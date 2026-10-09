// MR. MAS — Ep2 v1 art: SET-03, NOPEAI'S FIRST OFFICE, FEB 20, 2018, BY DAY (sc 4's F2.3) and SET-04, MOVE 37 (sc 4).
// Both in the T3 cut-paper memory tier (kit `paper`, `paperSprite`, `grain`: Ep1's, copied). The room is Ep1's first
// office (episodes/ep01/pixel/act1/art/v35.ts office2018 at night, act2/art/v35.ts officeDay by day), redrawn here
// FOUR MONTHS BEFORE Ep1's Jun 2018 night: fewer racks (one), the arena on ONE monitor, a whiteboard with AGI and three
// crossed-out arrows (they don't know the way yet), a Go stone on a desk, the all-hands in rows, the ladder and the
// ceiling hatch, Nole's slide ALSET · AI. Nobody applauds; the staff turn back to their monitors one by one (`turned`).
//   office2018feb(b, f, st)   [W] 4.28-4.30: st {turned: 0..8 (how many of the rows have turned back), nole: 'slide' |
//                             'ladder' | 'gone' | null, hatch: 0..2 (open, half, shut), mas: true (at the back, sipping),
//                             gerg: true}
//   arenaInsert(b, f)         [INSERT] 4.31: the arena match on the one monitor, playing on; nobody has paused it
//   alyiLooksBack(b, f, st)   [2S] 4.32: Alyi at the next desk, lit, cropped by his monitor's edge, turning to look back
//                             at Mas (st.turn 0..2); Mas lifting his glass an inch (st.lift)
//   move37(b, f, st)          SET-04 [ECU]/[W]: the 19 x 19 board in cut paper, slate and shell stones, the stone clicking
//                             down with its label MAR 2016 · GAME 2 · MOVE 37; behind it the wall of tiny knobs: st.stream
//                             'human' (tiny human boards pour in, every knob ticks a hair) | 'self' (the program's own
//                             boards) | 'frozen' (the wall stops); st.stone 0 (not yet) | 1 (clicking down) | 2 (placed)
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {arena} from '../../../../ep01/pixel/act1/art/v35';
import {drawMasStand} from '../../../../../shared/pixel/cast/mas-stand';
import {drawGergStand} from '../../../../../shared/pixel/cast/gerg-stand';
import {noleImg, NOLE_BASE, NOLE_FOOT} from '../../../../../shared/pixel/cast/nole';
import {drawMasPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import {blitImg} from '../../../../../shared/pixel/figure';
import {putBust} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {masPortrait} from '../../../../../shared/pixel/cast/mas';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, paper, paperSprite, grain, RH, TR, warmSkin} from '../kit';
import {seatedStaff, staffChair} from '../cast/civic2';
import {drawMasStand2} from '../cast/mas2';
import {alyiWarm} from '../cast/alyi2';
import {glassInHand} from '../../../../ep01/pixel/act1/art/v35';
import type {ArtAsset} from '../asset';

const FLOOR = 150;
const brick = (x: number, y: number) => { const row = Math.floor(y / 6), off = row % 2 ? 9 : 0; const mortar = y % 6 === 5 || (x + off) % 18 === 17; return mortar ? PAL.P0 : hash(Math.floor((x + off) / 18), row, 41) < 0.2 ? PAL.P0 : PAL.P1; };
const roomDay = (b: Buf) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 10 ? PAL.G4 : y < FLOOR ? brick(x, y) : (y - FLOOR) % 9 === 0 ? PAL.D3 : PAL.D4);
  paper(b, (t) => { fill(t, 0, 4, 480, 3, PAL.G5); fill(t, 0, 38, 480, 2, PAL.G4); for (const x of [60, 200, 330, 450]) fill(t, x, 0, 3, 10, PAL.G5); });
  // the warehouse windows at back left, February's pale daylight
  paper(b, (t) => {
    const W = {x0: 14, x1: 132, y0: 44, y1: 112};
    fill(t, W.x0 - 3, W.y0 - 3, W.x1 - W.x0 + 6, W.y1 - W.y0 + 6, PAL.G2);
    for (let y = W.y0; y < W.y1; y++) for (let x = W.x0; x < W.x1; x++) t.set(x, y, y < W.y0 + 30 ? (bayer(x, y) < 0.3 ? PAL.C7 : PAL.C8) : PAL.C7);
    for (const [bx, top, bw] of [[14, 84, 22], [36, 72, 16], [52, 90, 26], [78, 66, 14], [92, 80, 26], [118, 74, 14]] as Array<[number, number, number]>) fill(t, bx, top, bw, W.y1 - top, PAL.G6);
    for (let x = W.x0; x < W.x1; x += 30) fill(t, x, W.y0, 3, W.y1 - W.y0, PAL.G2);
    fill(t, W.x0, W.y0 + 34, W.x1 - W.x0, 3, PAL.G2);
  });
  // ONE rack (fewer than June's two), INVIDIA on its plate
  paper(b, (t) => {
    const rx = 428;
    fill(t, rx, 50, 42, FLOOR - 50, PAL.G2); fill(t, rx, 50, 42, 2, PAL.G4); fill(t, rx + 40, 50, 2, FLOOR - 50, PAL.G1);
    for (let u = 0; u < 12; u++) { const yy = 60 + u * 7; fill(t, rx + 3, yy, 36, 5, PAL.G1); for (let q = 0; q < 6; q++) fill(t, rx + 5 + q * 5, yy + 2, 3, 1, PAL.G3); }
    fill(t, rx + 3, 53, 36, 7, PAL.N1); tiny(t, 'INVIDIA', rx + 21 - (tinyWidth('INVIDIA') >> 1), 54, PAL.G6);
  });
  // the whiteboard: AGI and three arrows toward it, each crossed out (they don't know the way yet)
  paper(b, (t) => {
    const x0 = 150, y0 = 48;
    fill(t, x0 - 3, y0 - 3, 96, 64, PAL.G4); fill(t, x0, y0, 90, 58, PAL.P2);
    bpt(t, 'AGI', x0 + 86 - bpw('AGI') - 4, y0 + 6, PAL.I0);
    const arrows: Array<[number, number]> = [[x0 + 8, y0 + 12], [x0 + 8, y0 + 28], [x0 + 8, y0 + 44]];
    arrows.forEach(([ax, ay]) => { line(ax, ay, ax + 40, ay - Math.round((ay - y0 - 14) * 0.3), t.ink(PAL.I0)); line(ax + 40, ay - Math.round((ay - y0 - 14) * 0.3), ax + 36, ay - 3 - Math.round((ay - y0 - 14) * 0.3), t.ink(PAL.I0)); line(ax + 14, ay - 4, ax + 26, ay + 4, t.ink(PAL.R2)); line(ax + 14, ay + 4, ax + 26, ay - 4, t.ink(PAL.R2)); });
    fill(t, x0 + 4, y0 + 58, 30, 3, PAL.G3);
  });
  // the ceiling hatch over the ladder's spot (right of the slide)
};
const hatch = (b: Buf, open: number) => paper(b, (t) => { fill(t, 352, 8, 40, 4, PAL.G3); if (open < 2) fill(t, 356, 9, 32 - open * 14, 3, PAL.N1); });
const ladder = (b: Buf) => paper(b, (t) => { line(360, FLOOR, 366, 12, t.ink(PAL.G5)); line(384, FLOOR, 378, 12, t.ink(PAL.G5)); for (let r = 0; r < 12; r++) fill(t, 362 + Math.round(r * 0.5), FLOOR - 10 - r * 11, 20 - r, 1, PAL.G4); });
/** Nole's slide on a stand-up projection screen: ALSET · AI */
const slide = (b: Buf) => paper(b, (t) => {
  fill(t, 262, 30, 84, 56, PAL.G3); fill(t, 265, 33, 78, 50, PAL.P2);
  bpt(t, 'ALSET', 304 - Math.round(bpw('ALSET') / 2), 42, PAL.R1); pt(t, '·  AI', 290, 64, PAL.N2);
  fill(t, 302, 86, 4, FLOOR - 86, PAL.G2); fill(t, 290, FLOOR - 2, 28, 2, PAL.G2);
});
export interface Office18St { turned?: number; nole?: 'slide' | 'ladder' | 'gone' | null; hatch?: 0 | 1 | 2; mas?: boolean; gerg?: boolean }
export const office2018feb = (b: Buf, f: number, st: Office18St = {}) => {
  const s = {turned: 0, nole: 'slide' as Office18St['nole'], hatch: 0 as 0 | 1 | 2, mas: true, gerg: true, ...st};
  roomDay(b);
  slide(b);
  ladder(b);
  hatch(b, s.hatch);
  // the one monitor with the arena on it (left of the board), on a desk, a Go stone beside it
  paper(b, (t) => { fill(t, 40, 128, 70, 3, PAL.D2); fill(t, 44, 131, 2, 19, PAL.N1); fill(t, 104, 131, 2, 19, PAL.N1); fill(t, 56, 104, 38, 24, PAL.N1); fill(t, 72, 128, 6, 2, PAL.N1); });
  arena(b, 58, 106, 34, 20, f, 3);
  paper(b, (t) => { ellipse(100, 126, 3, 2, t.ink(PAL.N0)); t.set(99, 125, PAL.G4); });
  // the all-hands in rows (backs and three-quarters, facing Nole at screen-right); `turned` rows face their monitors:
  // each turned staffer has a monitor on the low desk in front of them (they turn back to it, nobody applauds); the
  // seats where Nole stands are empty (he stands in front of the rows, never under a staffer)
  const noleX = s.nole === 'slide' ? 248 : -999;
  paperSprite(b, (t) => {
    let k = 0;
    for (const [ry, n, x0] of [[150, 7, 140], [168, 8, 120], [186, 8, 100]] as Array<[number, number, number]>) for (let i = 0; i < n; i++, k++) {
      const x = x0 + i * 24;
      if (Math.abs(x + 12 - noleX) < 22 && ry > 160) continue;
      const turned = k < (s.turned ?? 0) * 3;
      staffChair(t, x, ry - 30, [PAL.G2, PAL.G3, PAL.G4]);
      if (turned) { fill(t, x - 9, ry - 16, 12, 2, PAL.D3); fill(t, x - 7, ry - 27, 9, 8, PAL.N1); fill(t, x - 6, ry - 26, 7, 6, PAL.C5); fill(t, x - 3, ry - 19, 2, 3, PAL.N1); }
      blitImg(t, seatedStaff({seed: k * 5 + 2, pose: turned ? 'type' : 'watch'}), x, ry - 30, {flip: turned});
    }
  });
  // Nole at the front, by his slide (in front of the rows), then up the ladder; daylight, his own warm skin
  if (s.nole === 'slide') paperSprite(b, (t) => blitImg(t, noleImg({...NOLE_BASE, arm: 'point', mouth: 1}), 248 - NOLE_FOOT[0], 186 - NOLE_FOOT[1], {map: warmSkin}), {keepSkin: true});
  if (s.nole === 'ladder') paperSprite(b, (t) => blitImg(t, noleImg({...NOLE_BASE, arm: 'raise', legs: 'w1'}), 372 - NOLE_FOOT[0], 112 - NOLE_FOOT[1], {map: warmSkin}), {keepSkin: true});
  if (s.gerg) paperSprite(b, (t) => drawGergStand(t, 334, 176, {legs: 'stand', type: Math.floor(f / 4) % 2 ? 1 : 2, look: 'screen', mouth: 'rest', light: 'room'}));
  if (s.mas) paperSprite(b, (t) => drawMasStand2(t, 30, 190, {arm: 'glass'}));
  grain(b, 0, 0, 480, RH, (x, y) => x >= 58 && x < 92 && y >= 106 && y < 126);
};
export const arenaInsert = (b: Buf, f: number) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, PAL.D2);
  paper(b, (t) => { fill(t, 70, 14, 340, 186, PAL.N1); fill(t, 70, 14, 340, 2, PAL.G3); }, 2);
  arena(b, 84, 26, 312, 166, f, 3);
  grain(b, 0, 0, 480, RH, (x, y) => x >= 84 && x < 396 && y >= 26 && y < 192);
};
export const alyiLooksBack = (b: Buf, f: number, st: {turn?: 0 | 1 | 2; lift?: boolean} = {}) => {
  // the room across (soft), Mas small at the back (left) with his glass, Alyi near (right) at his desk, lit by his
  // monitor, the monitor's edge cropping him at frame right
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y < 120 ? brick(x, y) : PAL.D4);
  // Mas at the back with his glass in his hand; on 4.32 the hand lifts it an inch (the forearm up, the glass with it)
  paperSprite(b, (t) => drawMasStand2(t, 80, 178, {arm: st.lift ? 'glassUp' : 'glass', mouth: 'smile'}));
  const turn = st.turn ?? 2;
  const img = alyiWarm({mood: turn === 2 ? 'smile' : 'calm', mouth: 'rest', arm: 'none', light: 'day'});
  paperSprite(b, (t) => putBust(t, img, 300, 46, {flip: turn === 0}), {rim: PAL.W6, side: 1});
  // his monitor's edge, close in the foreground, cropping him (his frame rule)
  paper(b, (t) => { fill(t, 400, 20, 80, 183, PAL.N1); fill(t, 400, 20, 4, 183, PAL.G3); fill(t, 404, 30, 76, 120, PAL.C3); }, 2);
  grain(b);
};

// ------------------------------------------------------------------ SET-04: Move 37
export interface Move37St { stone?: 0 | 1 | 2; stream?: 'human' | 'self' | 'frozen' | 'none'; label?: boolean }
const STONES: Array<[number, number, 0 | 1]> = [[3, 3, 0], [15, 3, 1], [3, 15, 1], [15, 15, 0], [16, 4, 0], [13, 2, 1], [2, 13, 0], [5, 2, 1], [16, 13, 1], [14, 16, 0], [9, 9, 1], [10, 3, 0], [4, 9, 1], [15, 9, 0], [12, 15, 1]];
export const move37 = (b: Buf, f: number, st: Move37St = {}) => {
  const s = {stone: 2 as 0 | 1 | 2, stream: 'human' as Move37St['stream'], label: true, ...st};
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, PAL.F1);
  // the wall of tiny knobs behind the board (the ghost's chevrons rearranged into dials): 24 x 9
  const tick = s.stream === 'frozen' || s.stream === 'none' ? 0 : Math.floor(f / 2);
  paper(b, (t) => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 26; c++) {
      const kx = 196 + c * 11, ky = 12 + r * 11;
      ellipse(kx, ky, 4, 4, t.ink(PAL.F3)); ellipse(kx, ky, 3, 3, t.ink(PAL.F4));
      // each knob's pointer: its angle steps a hair with every board that pours in (frozen: held where the match fixed it)
      const a = hash(c, r, 5) * Math.PI * 2 + (s.stream === 'frozen' ? 0.6 : tick * 0.18 * (hash(c, r, 6) > 0.5 ? 1 : -1));
      line(kx, ky, kx + Math.round(Math.cos(a) * 3), ky + Math.round(Math.sin(a) * 3), t.ink(PAL.C7));
    }
  }, 1);
  // the board: 19 x 19 in cut paper (kaya yellow), its lines, the star points, the stones (slate and shell)
  const gx = 40, gy = 30, cell = 8;
  paper(b, (t) => {
    fill(t, gx - 8, gy - 8, cell * 18 + 16, cell * 18 + 16, PAL.W5);
    for (let i = 0; i < 19; i++) { fill(t, gx + i * cell, gy, 1, cell * 18 + 1, PAL.D2); fill(t, gx, gy + i * cell, cell * 18 + 1, 1, PAL.D2); }
    for (const [sx, sy] of [[3, 3], [9, 3], [15, 3], [3, 9], [9, 9], [15, 9], [3, 15], [9, 15], [15, 15]]) fill(t, gx + sx * cell - 1, gy + sy * cell - 1, 3, 3, PAL.D1);
  }, 2);
  const stoneAt = (sx: number, sy: number, white: 0 | 1, dy = 0) => paper(b, (t) => { const cx = gx + sx * cell, cy = gy + sy * cell + dy; ellipse(cx, cy, 3.6, 3.6, t.ink(white ? PAL.P2 : PAL.N1)); t.set(cx - 1, cy - 2, white ? PAL.W9 : PAL.G3); }, 1);
  STONES.forEach(([sx, sy, w]) => stoneAt(sx, sy, w));
  // Move 37: the black stone on the fifth line, clicking down
  if (s.stone) stoneAt(4, 10, 0, s.stone === 1 ? -3 : 0);
  // the stream of tiny boards (human games: a face over each; the program's own: a cyan glint) pouring in over the
  // board's top edge and down into the wall; each one, as it arrives, lights the knob it lands on
  if (s.stream === 'human' || s.stream === 'self') for (let k = 0; k < 22; k++) {
    const ph = ((f * 5 + k * 29) % 300) / 300;
    const bx = Math.round(-12 + ph * 230), by = Math.round(4 + ph * ph * 60 + ((k * 13) % 14));
    if (bx > 206) { const kc = Math.min(25, Math.floor((bx - 196) / 11)), kr = Math.min(8, Math.floor((by - 12) / 11)); ellipse(196 + kc * 11, 12 + kr * 11, 4, 4, b.ink(PAL.C5)); continue; }
    fill(b, bx, by, 9, 9, PAL.W5); for (let i = 0; i < 9; i += 2) { fill(b, bx + i, by, 1, 9, PAL.D2); fill(b, bx, by + i, 9, 1, PAL.D2); }
    b.set(bx + 2, by + 2, PAL.N0); b.set(bx + 6, by + 4, PAL.P2); b.set(bx + 4, by + 6, PAL.N0);
    if (s.stream === 'human') { fill(b, bx + 3, by - 4, 3, 3, PAL.S4); fill(b, bx + 3, by - 4, 3, 1, PAL.B2); }
    else { fill(b, bx + 3, by - 3, 3, 2, PAL.C6); b.set(bx + 4, by - 4, PAL.C8); }
  }
  if (s.label && s.stone === 2) {
    const L = 'MAR 2016 · GAME 2 · MOVE 37';
    paper(b, (t) => { fill(t, 30, 186, pw(L) + 12, 14, PAL.P2); pt(t, L, 36, 189, PAL.N1); });
    line(gx + 4 * cell + 4, gy + 10 * cell + 4, 60, 186, b.ink(PAL.P2));
  }
  grain(b);
};

export const ART: ArtAsset[] = [
  {
    id: 'set03-office2018', manifest: 'SET-03 · NopeAI\'s first office, Feb 2018 (T3)', kind: 'set', name: 'The first office by day, four months before Ep1\'s June night',
    file: 'sets/office2018.ts', exports: 'office2018feb, arenaInsert, alyiLooksBack', scenes: '4 (F2.3)',
    note: 'T3 cut paper: one rack, the arena on one monitor, AGI with three crossed-out arrows, the Go stone, ALSET · AI, the ladder and hatch; nobody applauds',
    stills: [
      {label: '[W] 4.28: Nole mid-speech at his slide ALSET · AI, the all-hands facing him, Gerg typing, Mas at the back with his glass', draw: (b) => office2018feb(b, 0, {turned: 0})},
      {label: '[W] 4.30: the rows turned back to their monitors, Nole up the ladder to the hatch, Mas sipping', draw: (b) => office2018feb(b, 12, {turned: 3, nole: 'ladder', hatch: 1})},
      {label: '[INSERT] 4.31 the arena on the one monitor plays on', draw: (b) => arenaInsert(b, 30)},
      {label: '[2S] 4.32 Alyi, lit, cropped by his monitor\'s edge, turns and looks back at Mas, who lifts his glass', draw: (b) => alyiLooksBack(b, 0, {turn: 2, lift: true})},
    ],
  },
  {
    id: 'set04-move37', manifest: 'SET-04 · Move 37: the board and the knob wall (T3)', kind: 'set', name: 'Move 37: the Go board, the stone, the wall of knobs',
    file: 'sets/office2018.ts', exports: 'move37', scenes: '4',
    note: 'the 19 x 19 board in cut paper, slate and shell stones; tiny human boards pour into the wall of knobs and tick them; then the program\'s own boards; then the wall freezes; no players, no hands',
    stills: [
      {label: 'the stone clicked down, MAR 2016 · GAME 2 · MOVE 37; the stream of human games ticking every knob', draw: (b) => move37(b, 20, {stone: 2, stream: 'human'})},
      {label: '"Then it played itself": the program\'s own boards pouring in (cyan); and the frozen wall', draw: (b) => move37(b, 40, {stone: 2, stream: 'self'})},
    ],
  },
];
void rect; void clamp; void stepColor; void drawMasPortrait; void MAS_PORTRAIT_DEFAULT; void masPortrait; void TR;
