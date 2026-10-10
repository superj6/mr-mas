// MR. MAS — Ep2 v1 · act4 · sc 18 PRESENT (MAY 28, 2024): the NopeAI boardroom by day, the committee (the shots pass,
// 2026-10-09; the record is shots-act4.md). The room is Ep1's boardroom (rooms/boardroom, imported read-only) on Act
// One's morning camera (act1/sets/board.ts: its morning grade and layering, COPIED here so the acts never share a cache
// key), dressed for May 28: the SAFETY AND SECURITY COMMITTEE banner hung across the window's top, a TV on the back wall
// (on before the meeting: a plain podcast player, no show name, no logo), the committee at the table (TERB at the head,
// MAS beside him at seat A, MADA at C, one unplated director at D), the beacon's beam crossing the window.
//   day18(b, f, st)        [W] the table by day from the room's camera (18.02 the beam; the split's left pane at room
//                          scale in 18.07: Terb holding the lanyard out across the table's corner, Mas taking it and
//                          putting it on himself, in three held drawings)
//   podTV(b, f, st)        [SCR] 18.03-18.05 full frame: the plain player, her words captioned LARGE as she says them
//                          (word by word, from the take's words), the waveform walking with her voice, the board's
//                          one-sentence statement card under her last caption (18.05: the two side by side)
//   masHold(b, f)          [MCU] 18.06: Mas at the table, still (Ep1's approved CU face, a face light one step)
//   terbRemote(b, f, st)   [OTS] 18.06: over Mas's shoulder onto TERB (his approved portrait, no helmet), the TV's cool
//                          light on his near side until he clicks it off with the remote in his hand; lip-synced
//   lanyardInsert(b, f)    [INSERT] 18.07's head: Terb's hand holding out the SAFETY COMMITTEE lanyard, its card legible
//   terbPane(b, f, st)     [M] 18.08 / 18.10 (left pane): TERB reading his sheet like a roll call, lip-synced
//   masPane(b, f, st)      [MCU] 18.09-18.14 (left pane): MAS at the table (his approved portrait in the window's day,
//                          keyed one step), turned to Terb, the lanyard's card on his chest; lip-synced
//   minutesInsert(b, f, st) [INSERT] 18.10 (left pane): Mada's minutes, his pen writing one word, then a second
//   (day18 with look 'mas' is the table at room scale in the left pane, SXL_TABLE: every face turned to Mas)
//   phonePane(b, f, st)    [ECU] 18.15: his phone face up on the table (beside his lanyard's card), its reminder
//                          `ELPPA · KEYNOTE · JUN 10`, his hand turning it over; `open` 0..1 widens the left pane to the
//                          full frame (the split ends) with the phone moving to where the lobby's wall screen is in 19.01
// No V.O. in this file's shots but 18.10's (the host types it). Her words only, captioned verbatim (W8, W16).
import {Buf, rect, line, ellipse, poly, bayer, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf, FAMILIES} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import {boardroomLayers, BR} from '../../../../../shared/pixel/rooms/boardroom';
import {overlay} from '../../../../../shared/pixel/rooms/setkit';
import {terbSheetRoom, TERB_SHEET_DEFAULT} from '../../../../../shared/pixel/cast/terb-sheet';
import {TERB_FOOT, terbPortrait} from '../../../../../shared/pixel/cast/terb';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {drawMadaSeated, MADA_SEAT_DEFAULT} from '../../../../../shared/pixel/cast/mada';
import {drawMadaMedium, MADA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/mada-medium';
import {drawSenator} from '../../../../../shared/pixel/cast/civic-extras';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import type {MasSeatedArm} from '../../../../../shared/pixel/cast/mas-seated';
import {masCU} from '../../../../../shared/pixel/cast/mas-cu';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {placeHand, drawHand, sleeve, holdPhone, POSES, skinDown} from '../../art/cast/hands2';
import {fill, pt, pw, pwrap, bpt, bpw, bpwrap, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, glow, putBustSoft} from './common';
import {drawBackHead} from './backhead';

// ================================================================== the room by day (Act One's morning, copied)
const PLATES18 = {A: 'MAS MANALT', B: null, C: null, D: null, E: null};
/** the left pane's crop of the room-scale table (x 20..257: Terb at L, Mas at A, the director at B, Mada at C) */
export const SXL_TABLE = 20;
const LAY = new Map<string, ReturnType<typeof boardroomLayers>>();
/** the morning: every lit layer a rung or two up and warmer, the window a pale sky with the hills and the city soft
 *  (act1/sets/board.ts morning, copied) */
const morning = (src: Buf, opaque: boolean) => {
  const b = new Buf(W, RH, 0);
  b.c.set(src.c);
  const Wn = BR.WINDOW;
  const G = FAMILIES.G;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const c = b.c[y * W + x];
    if (!opaque && c === 0x1000000) continue;
    const inWin = opaque && x >= Wn.x0 && x < Wn.x1 && y >= Wn.y0 && y < Wn.y1;
    if (inWin) {
      const mull = Wn.panes.some(([a, z]) => x === a || x === z - 1) || x === Wn.x0;
      const t = (y - Wn.y0) / (Wn.y1 - Wn.y0);
      const hill = Wn.y0 + 46 + Math.round(Math.sin(x / 23) * 4 + Math.sin(x / 7) * 1.5);
      const city = hill + 8 + Math.round(((x * 7) % 11) / 2);
      let col = t < 0.25 ? (bayer(x, y) < 0.5 ? PAL.P2 : PAL.G6) : PAL.P2;
      if (y > hill) col = bayer(x, y) < 0.5 ? PAL.G5 : PAL.G6;
      if (y > city) col = (x + y * 3) % 7 === 0 ? PAL.P1 : PAL.G5;
      b.c[y * W + x] = mull ? PAL.G3 : col;
      continue;
    }
    const fm = familyOf(c);
    if (!fm) continue;
    const [fam, i] = fm;
    let v = c;
    const near = x < 170 ? 1 : x >= 270 ? 0 : bayer(x, y) < (270 - x) / 100 ? 1 : 0;
    if (fam === 'N' || fam === 'C' || fam === 'F' || fam === 'U') v = G[Math.min(G.length - 1, i + 1 + near)];
    else if (fam === 'G') v = G[Math.min(G.length - 1, i + 2)];
    else if (fam === 'D' || fam === 'W' || fam === 'B') v = stepColor(c, 1 + near);
    b.c[y * W + x] = v;
  }
  return b;
};
const dayLayers = () => {
  const key = JSON.stringify(PLATES18);
  let L = LAY.get(key);
  if (!L) {
    const n = boardroomLayers({f: 0, plates: PLATES18, rolodex: false, pendant: 0});
    L = {far: morning(n.far, true), mid: morning(n.mid, false), front: morning(n.front, false), fore: morning(n.fore, false)};
    LAY.set(key, L);
  }
  return L;
};
const SEN_Y = 172;
/** a pixel a rung up and toward tungsten (the beam's spill on the room) */
const warmUp = (c: number) => { const fm = familyOf(c); if (!fm) return c; const [fam, i] = fm; if (fam === 'G' || fam === 'N') return FAMILIES.W[Math.min(FAMILIES.W.length - 1, i + 2)]; return stepColor(c, 1); };
/** the wall TV (on the back wall between the charter and the door) */
export const TV18 = {x: 278, y: 44, w: 78, h: 44};
/** the banner hung across the window's top on two wires (the SAFETY AND SECURITY COMMITTEE) */
const banner = (b: Buf) => {
  const s = 'SAFETY AND SECURITY COMMITTEE', w = pw(s) + 16, x = 36, y = 22;
  for (const tx of [x + 6, x + w - 7]) line(tx, BR.WINDOW.y0 - 6, tx, y, b.ink(PAL.G2));
  fill(b, x + 1, y + 1, w, 15, PAL.N1);
  fill(b, x, y, w, 15, PAL.F2); fill(b, x, y, w, 1, PAL.F4); fill(b, x, y + 14, w, 1, PAL.F1);
  pt(b, s, x + 8, y + 4, PAL.P2);
};
/** the TV's picture at the wall's scale: the plain player (a blank art square, the waveform walking with her voice, the
 *  scrubber); `lvl` 0..1 her voice's loudness; `off` dark */
const tvWall = (b: Buf, f: number, lvl: number, off: boolean) => {
  const T = TV18;
  fill(b, T.x - 2, T.y - 2, T.w + 4, T.h + 4, PAL.N0); fill(b, T.x - 2, T.y - 2, T.w + 4, 1, PAL.G3);
  if (off) { fill(b, T.x, T.y, T.w, T.h, PAL.N1); for (let i = 0; i < 12; i++) b.set(T.x + T.w - 16 + i, T.y + 3 + (i >> 1), PAL.N3); return; }
  fill(b, T.x, T.y, T.w, T.h, PAL.N2);
  fill(b, T.x + 4, T.y + 5, 18, 18, PAL.N3); fill(b, T.x + 8, T.y + 9, 10, 10, PAL.N4);
  for (let k = 0; k < 11; k++) { const h = 1 + Math.round((0.3 + 0.7 * lvl) * (2 + ((k * 7 + Math.floor(f / 3) * 3) % 9))); fill(b, T.x + 26 + k * 4, T.y + 14 - (h >> 1), 2, h, PAL.C5); }
  fill(b, T.x + 26, T.y + 26, 44, 1, PAL.N4); fill(b, T.x + 26, T.y + 26, 20, 1, PAL.C6);
  fill(b, T.x + 4, T.y + 32, T.w - 8, 3, PAL.P1); fill(b, T.x + 4, T.y + 37, T.w - 24, 3, PAL.P1);
};
export interface Day18St {
  /** the TV: her voice's loudness 0..1, or off */
  tv?: number | 'off';
  /** the beacon's beam across the window, 0..1 (left to right), or none */
  beam?: number;
  /** the lanyard: 0 none · 1 Terb holds it out across the corner · 2 Mas has it (his hand on it at Terb's) · 3 over his
   *  head (his hands up) · 4 on, its card on his chest */
  lanyard?: 0 | 1 | 2 | 3 | 4;
  /** heads: 'fwd' (the table's own business) or 'mas' (every face turned to him) */
  look?: 'fwd' | 'mas';
}
/** Terb at the head (seat L): seated, his sheet down; his near arm out across the table's corner with the lanyard
 *  (room scale: the shirtsleeve from the shoulder to the elbow to the hand, the lanyard hanging from his fingers) */
const terbAt = (b: Buf, st: Day18St) => {
  const holding = (st.lanyard ?? 0) >= 1 && (st.lanyard ?? 0) <= 2;
  const pose = {...TERB_SHEET_DEFAULT, legs: 'seat' as const, arm: 'none' as const, helmet: false, read: !holding && st.look !== 'mas', mouth: 'rest' as const, light: 'room' as const};
  const img = terbSheetRoom(pose), x0 = BR.SEATS.L.x + 2 - TERB_FOOT[0], y0 = 194 - TERB_FOOT[1];
  const RED = new Set([PAL.R0, PAL.R1, PAL.R2, PAL.R3]), NOZ = new Set([PAL.G1, PAL.G6]);
  blitImg(b, img, x0, y0, {clip: (px, py) => { const i = px - x0, j = py - y0, v = img.c[j * img.w + i]; if (RED.has(v)) return false; return !(NOZ.has(v) && i >= 8 && i <= 30 && j >= 50 && j <= 90); }});
  if (holding) {
    // the near arm out toward seat A: the white shirtsleeve (two tones, its underside a rung down), the hand at the
    // table's corner, the lanyard hanging from his fingers (its card turned to Mas)
    const sh: [number, number] = [x0 + 30, y0 + 42], el: [number, number] = [sh[0] + 14, sh[1] + 8], hd: [number, number] = [el[0] + 18, el[1] - 4];
    for (const [a, z] of [[sh, el], [el, hd]] as Array<[[number, number], [number, number]]>) { line(a[0], a[1], z[0], z[1], b.ink(PAL.G6)); line(a[0], a[1] + 1, z[0], z[1] + 1, b.ink(PAL.G5)); line(a[0], a[1] + 2, z[0], z[1] + 2, b.ink(PAL.G3)); }
    fill(b, hd[0], hd[1] - 1, 4, 3, PAL.S4); fill(b, hd[0] + 1, hd[1] + 2, 3, 1, PAL.S2);
    if (st.lanyard === 1) lanyardRoom(b, hd[0] + 2, hd[1] + 1, 'hang');
  }
};
/** the lanyard at room scale: a red strap loop and the white card. 'hang' from a hand at (x, y) · 'up' a loop held
 *  over a head at (x, y) (the crown) · 'on' round a neck at (x, y) (the collar's middle), the card on the chest */
export const lanyardRoom = (b: Buf, x: number, y: number, how: 'hang' | 'up' | 'on') => {
  const R = PAL.R2, R1 = PAL.R1;
  if (how === 'hang') { line(x - 2, y, x, y + 9, b.ink(R)); line(x + 2, y, x + 1, y + 9, b.ink(R1)); fill(b, x - 2, y + 10, 6, 7, PAL.P2); fill(b, x - 2, y + 10, 6, 2, PAL.R2); return; }
  if (how === 'up') {
    // the loop passing over his head: its two straps down either side of his head from above the crown (where his hand
    // holds it), the card swinging under his chin
    line(x - 6, y - 4, x - 5, y + 10, b.ink(R)); line(x + 6, y - 4, x + 5, y + 10, b.ink(R1)); line(x - 6, y - 4, x + 6, y - 4, b.ink(R));
    fill(b, x - 3, y + 11, 6, 7, PAL.P2); fill(b, x - 3, y + 11, 6, 2, PAL.R2);
    return;
  }
  line(x - 4, y - 2, x - 1, y + 7, b.ink(R)); line(x + 4, y - 2, x + 1, y + 7, b.ink(R1)); fill(b, x - 2, y + 8, 6, 7, PAL.P2); fill(b, x - 2, y + 8, 6, 2, PAL.R2);
};
/** Mas at seat A: seated (Ep1's rig), his arm per the lanyard's step; the lanyard on him once it's on */
const SEAT_A_X = BR.SEATS.A.x - 6;
const masAt = (b: Buf, st: Day18St) => {
  const l = st.lanyard ?? 0;
  const arm: MasSeatedArm = l === 2 ? 'reach' : l === 3 ? 'hold' : 'lap';
  drawMasSeated(b, SEAT_A_X, 134, {...MAS_SEATED_DEFAULT, arm, head: 'host', collars: 3, light: 'room'}, {flip: true});
  // (the seated rig's face is at local [22, 8], its seat at [17, 44]; flipped, the face sits to the left of the seat)
  const fx = SEAT_A_X - 5, fy = 134 - 44 + 8;
  if (l === 3) lanyardRoom(b, fx, fy - 6, 'up');
  if (l === 4) lanyardRoom(b, fx + 1, fy + 12, 'on');
};
export const day18 = (b: Buf, f: number, st: Day18St = {}) => {
  const L = dayLayers();
  overlay(b, L.far);
  tvWall(b, f, typeof st.tv === 'number' ? st.tv : 0, st.tv === 'off');
  overlay(b, L.mid);
  banner(b);
  // seated: the unplated director (B), Mada (C) perfectly still; Mas at A beside Terb; on the roll call every face
  // turns to Mas (screen-left of them)
  drawSenator(b, BR.SEATS.B.x, SEN_Y, 2, 'sit', {flip: st.look === 'mas'});
  drawMadaSeated(b, BR.SEATS.C.x, 152, {...MADA_SEAT_DEFAULT, light: 'room'}, {spin: null, flip: st.look === 'mas'});
  masAt(b, st);
  overlay(b, L.front);
  terbAt(b, st);
  overlay(b, L.fore);
  glow(b, 150, 150, 170, 60, 1);
  // the beacon's beam across the window, the same morning: a soft band of light walking left to right in held steps
  // (warm: in the day's pale window a brightening alone doesn't read; the beacon's tungsten does)
  if (st.beam !== undefined && st.beam >= 0) {
    const Wn = BR.WINDOW, x0 = Wn.x0 - 30 + Math.round(st.beam * (Wn.x1 - Wn.x0 + 60));
    for (let y = Wn.y0; y < Wn.y1 + 50; y++) for (let x = x0 - 20; x < x0 + 20; x++) {
      const sx = x + Math.round((y - Wn.y0) * 0.35);
      const a = 1 - Math.abs(x - x0) / 20;
      if (a <= 0 || sx < 0 || sx >= W) continue;
      const inWin = sx >= Wn.x0 && sx < Wn.x1 && y < Wn.y1;
      if (inWin) { if (bayer(sx, y) < a * 0.9) b.set(sx, y, a > 0.55 ? PAL.W8 : PAL.W7); }
      else if (bayer(sx, y) < a * 0.4) b.set(sx, y, warmUp(b.get(sx, y)));
    }
  }
};

// ================================================================== the podcast player at full frame (18.03-18.05)
export interface PodSt {
  /** her caption: the words said so far (whole words), one string per sentence (each starts its own line) */
  cap: string | string[];
  /** her voice's loudness 0..1 (the waveform) */
  lvl: number;
  /** the board's statement card (open steps since it landed; undefined = none) */
  card?: number;
}
export const podTV = (b: Buf, f: number, st: PodSt) => {
  // the TV's bezel at the frame's edge, a plain player (no title, no logo): a blank square where art would be, the
  // waveform, the scrubber; her words captioned large as she says them
  fill(b, 0, 0, W, RH, PAL.N0); fill(b, 4, 4, W - 8, RH - 8, PAL.N1);
  fill(b, 20, 14, 70, 70, PAL.N3); fill(b, 20, 14, 70, 1, PAL.N4);
  for (let k = 0; k < 4; k++) ellipse(55, 49, 6 + k * 7, 6 + k * 7, (x, y) => { if (x > 20 && x < 89 && y > 14 && y < 83) b.set(x, y, k % 2 ? PAL.N4 : PAL.N2); });
  fill(b, 52, 46, 7, 7, PAL.N5);
  const ph = Math.floor(f / 2);
  for (let k = 0; k < 64; k++) {
    const base = 0.25 + 0.75 * (((k * 37 + ph * 11) % 17) / 16) * (0.6 + 0.4 * Math.sin(k * 0.7 + ph * 0.9));
    const h = 2 + Math.round(st.lvl * base * 22);
    fill(b, 106 + k * 5, 49 - (h >> 1), 3, h, k < 40 ? PAL.C6 : PAL.C4);
  }
  fill(b, 106, 76, 320, 2, PAL.N4); fill(b, 106, 76, 200 + Math.floor(f / 24), 2, PAL.C6); fill(b, 304 + Math.floor(f / 24), 74, 2, 6, PAL.P1);
  // the caption: the display face, wrapped, white on the player's dark (large: legible at 1080p)
  const lines = ([] as string[]).concat(st.cap).filter((c) => c).flatMap((c) => bpwrap(c, 436));
  const cy = st.card !== undefined ? 92 : 102;
  lines.slice(-3).forEach((l, i) => bpt(b, l, 22, cy + i * 18, PAL.P2));
  if (st.card !== undefined && st.card >= 0) {
    // the board's same-day reply: its first sentence, in its own statement card beneath her caption
    const open = Math.min(1, (st.card + 1) / 3), h = Math.max(3, Math.round(40 * open)), y = 152 + Math.round((40 - h) / 2);
    fill(b, 16, y - 1, W - 32, h + 2, PAL.N0); fill(b, 16, y, W - 32, h, PAL.P1); fill(b, 16, y, W - 32, 2, PAL.G5);
    if (open >= 1) {
      pt(b, '"We are disappointed that Ms. NELEH continues to revisit these issues."', 26, y + 9, PAL.N1);
      pt(b, '— TERB, CHAIR', W - 32 - pw('— TERB, CHAIR') - 8, y + 25, PAL.N3);
    }
  }
};

// ================================================================== 18.06: his face; Terb clicks the TV off
/** the room behind a medium (the far wall by day: the slats, the window's light from the left), soft (act1's) */
let SOFT: Buf | null = null;
const roomSoft = () => {
  if (SOFT) return SOFT;
  const b = new Buf(W, RH, PAL.G3);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const t = x / W + (bayer(x, y) - 0.5) * 0.1;
    const slat = x > 200 && (x % 9) < 2;
    b.set(x, y, y > 150 ? (y === 151 ? PAL.D4 : (x * 3 + y) % 37 < 2 ? PAL.D2 : PAL.D3) : t < 0.35 ? (y < 120 ? (bayer(x, y) < 0.5 ? PAL.P2 : PAL.G6) : PAL.G5) : slat ? PAL.G3 : t < 0.6 ? PAL.G5 : PAL.G4);
  }
  SOFT = b;
  return b;
};
/** [MCU] Mas at the table, holding still: Ep1's approved CU face (no mouths, no blink: one silent, unchanging face),
 *  the window's day keyed on it one step (the cool CU's tungsten variant), the room a rung down behind him */
export const masHold = (b: Buf, f: number) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  blitImg(b, masCU('tungsten'), 0, 0, {clip: (_x, y) => y < RH});
  void f;
};
/** [OTS] over Mas's shoulder onto TERB at the head (his approved portrait, helmet off), the remote in his near hand
 *  (Ep1's insert-hands grip); the TV's cool light on his near side until `off`; lip-synced */
export const terbRemote = (b: Buf, f: number, st: {mouth?: Viseme; off?: boolean; aim?: number}) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  const img = terbPortrait({mouth: st.mouth ?? 'rest', lid: 0, look: 1, brow: 'level', helmet: false});
  // the TV's cool spill on his near (screen-right) side, gone when it clicks off
  const map = st.off ? undefined : (c: number) => { const fm = familyOf(c); return fm && fm[0] === 'S' && fm[1] >= 3 ? stepColor(c, 0) : c; };
  putBustCut(b, img, 120, 44, RH, true);
  // (the shots pass: mirrored, the portrait's lit shoulder (cream, its warm rim) lands behind the remote hand and
  // peeked out above the fingers as a pale sliver; his far shoulder takes the shirt's own shade there)
  for (let y = 128; y < 168; y++) for (let x = 186; x < 236; x++) { const c = b.get(x, y), fm = familyOf(c); if (fm && (fm[0] === 'P' || fm[0] === 'W' || (fm[0] === 'G' && fm[1] >= 6))) b.set(x, y, fm[0] === 'W' ? PAL.G3 : PAL.G5); }
  if (!st.off) for (let y = 44; y < RH; y++) for (let x = 120 + 66; x < 120 + 112; x++) { const c = b.get(x, y), fm = familyOf(c); if (fm && (fm[0] === 'S') && bayer(x, y) < (x - 186) / 46 * 0.6) b.set(x, y, fm[1] >= 4 ? PAL.K4 : PAL.K3); }
  void map;
  // his near hand up at his chest with the remote pointed past us at the TV (the remote a small dark bar in the grip)
  const R = {x: 222 + Math.round((st.aim ?? 0) * 4), y: 160 - Math.round((st.aim ?? 0) * 6), w: 12, h: 40};
  holdPhone(b, R, {side: 'R', grip: 'wrap', light: 'lobby', widthCm: 3.4, thumbAt: 0.3, sleeveTo: [300, 270],
    cuffRamp: [PAL.G3, PAL.G4, PAL.G4, PAL.G5, PAL.G6, PAL.G6, PAL.P2], sleeveRamp: [PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
    drawPhone: (bb) => { fill(bb, R.x, R.y, R.w, R.h, PAL.N1); fill(bb, R.x, R.y, R.w, 1, PAL.N4); fill(bb, R.x + 3, R.y + 4, 5, 3, st.off ? PAL.N3 : PAL.R2); for (let q = 0; q < 3; q++) fill(bb, R.x + 3, R.y + 12 + q * 6, 6, 2, PAL.N3); }});
  // Mas's back and shoulder in the right foreground (seated beside the head: the back of his head, the hood)
  drawBackHead(b, 330, 70, {scale: 1.35, turn: 1, light: 'monitor'}, (c) => stepColor(c, 1));
};

// ================================================================== 18.07: the lanyard held out
/** [INSERT] Terb's hand (from the left: the head of the table) holding the lanyard out by its strap, the card turned to
 *  us: SAFETY COMMITTEE, legible; the table's wood and the window's light soft behind */
export const lanyardInsert = (b: Buf, f: number, st: {sway?: number} = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const t = y / RH;
    b.set(x, y, t > 0.62 ? ((x * 3 + y * 7) % 61 < 2 ? PAL.D2 : PAL.D3) : x < 200 ? (bayer(x, y) < 0.6 ? PAL.P1 : PAL.G6) : (x % 9 < 2 ? PAL.G3 : PAL.G4));
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  const sw = st.sway ?? 0;
  // the card: a white badge in a clear sleeve, the red strap up from its clip to his fingers
  const cx = 250 + sw, cy = 104;
  const s1 = 'SAFETY', s2 = 'COMMITTEE', cw = Math.max(bpw(s1), bpw(s2)) + 24, ch = 58;
  // the strap: two red bands rising from the card's clip to the pinch
  const top: [number, number] = [cx - 30, 22];
  for (let i = 0; i < 4; i++) { line(cx - 4 + i, cy - 8, top[0] + i, top[1], b.ink(i < 2 ? PAL.R2 : PAL.R1)); line(cx + 8 + i, cy - 8, top[0] + 12 + i, top[1] + 2, b.ink(i < 2 ? PAL.R2 : PAL.R1)); }
  fill(b, cx - 6, cy - 10, 18, 6, PAL.G5); fill(b, cx - 6, cy - 10, 18, 1, PAL.G6);
  fill(b, cx - (cw >> 1) + 3, cy - 3, cw, ch, PAL.N1);
  fill(b, cx - (cw >> 1), cy - 4 + 1, cw, ch, PAL.P2); fill(b, cx - (cw >> 1), cy - 4 + 1, cw, 8, PAL.R2);
  bpt(b, s1, cx - (bpw(s1) >> 1), cy + 12, PAL.N1); bpt(b, s2, cx - (bpw(s2) >> 1), cy + 30, PAL.N1);
  // his hand pinching the strap's loop (the white cuff, the shirtsleeve out of frame left)
  const h = placeHand(POSES.pinch([0.6, -0.45, -0.66], [0.15, -0.75, 0.64], 'R'), {s: 5.2, at: [top[0] + 6, top[1] + 2], anchor: 'thumb', light: 'lobby', cuffRamp: [PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P1, PAL.P1, PAL.P2]});
  sleeve(b, h.cuffEnd, [h.cuffEnd[0] - 220, h.cuffEnd[1] + 40], 22, 26, [PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2]);
  drawHand(b, h.hand, h.x, h.y);
  void f;
};

// ================================================================== the left pane's mediums (18.08-18.10)
/** [M] TERB reading his sheet like a roll call (his approved portrait, helmet off, eyes down on the sheet), lip-synced;
 *  drawn into a full frame for the split's left pane (its 238 px crop from x 0) */
export const terbPane = (b: Buf, f: number, st: {mouth?: Viseme; read?: boolean}) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  const img = terbPortrait({mouth: st.mouth ?? 'rest', lid: st.read === false ? 0 : 1, look: st.read === false ? -1 : 0, brow: 'level', helmet: false});
  putBustCut(b, img, 70, 40, RH, false);
  // his single sheet low at the frame's foot in his hand (its top edge tilted toward him, the lines of the post he's
  // reading from), his fingers on its corner
  poly([108, RH + 2, 114, 180, 176, 176, 182, RH + 2], b.ink(PAL.P2)); for (let r = 0; r < 3; r++) line(120, 185 + r * 5, 170, 182 + r * 5, b.ink(PAL.G5));
  fill(b, 172, 178, 7, 9, PAL.S4); fill(b, 172, 178, 7, 1, PAL.S5); fill(b, 172, 186, 7, 1, PAL.S2);
  void f;
};
/** [MCU] Mas at the table in the left pane: his approved portrait in the window's day, keyed one step from the window,
 *  turned to Terb at the head (camera-left: the portrait's own angle), the committee lanyard's card on his chest; the
 *  room soft behind; lip-synced (drawn in a full frame for the pane's 238 px crop from x 0) */
export const masPane = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']}) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  putBustSoft(b, masDayFace({mouth: st.mouth ?? 'rest', look: -1}), 70, 30, RH, false);
  // the lanyard: the red strap from behind his neck down his chest, the card
  const lx = 128, ly = 152;
  for (let i = 0; i < 2; i++) { line(lx - 14 + i, ly - 34, lx - 3 + i, ly, b.ink(i ? PAL.R1 : PAL.R2)); line(lx + 16 + i, ly - 36, lx + 6 + i, ly, b.ink(i ? PAL.R1 : PAL.R2)); }
  fill(b, lx - 6, ly, 16, 20, PAL.P2); fill(b, lx - 6, ly, 16, 4, PAL.R2); fill(b, lx - 4, ly + 8, 12, 1, PAL.G4); fill(b, lx - 4, ly + 12, 9, 1, PAL.G4);
  void f;
};
const masDayF = new Map<string, ReturnType<typeof masPortrait>>();
const masDayFace = (s: Partial<MasPortraitState>) => {
  const key = JSON.stringify(s); const hit = masDayF.get(key); if (hit) return hit;
  const im = faceLightImg(masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...s}), 1, {key: [-1, -0.3]});
  masDayF.set(key, im);
  return im;
};
/** [INSERT] the minutes (left pane): Mada's pad on the table, his pen hand writing one word (`w` 0..2), then a second
 *  (2..4): a scribble, nothing legible */
export const minutesInsert = (b: Buf, f: number, st: {w: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x * 3 + y * 7) % 61 < 2 ? PAL.D2 : PAL.D3);
  glow(b, 40, 20, 200, 120, 1);
  const px = 30, py = 40;
  fill(b, px + 3, py + 3, 170, 140, PAL.D1); fill(b, px, py, 170, 140, PAL.P2); fill(b, px, py, 170, 1, PAL.W9);
  for (let r = 0; r < 9; r++) fill(b, px + 10, py + 22 + r * 12, 150, 1, PAL.C6);
  fill(b, px + 30, py, 1, 140, PAL.R2);
  // the earlier minutes (scribbles), then today's two words on the next line
  for (let r = 0; r < 4; r++) for (let i = 0; i < 110 - (r * 23) % 40; i += 3) b.set(px + 36 + i, py + 18 + r * 12 + ((i * 7) % 5 === 0 ? -1 : 0), PAL.N3);
  const lineY = py + 18 + 4 * 12;
  const scrib = (x0: number, n: number) => { for (let i = 0; i < n; i++) b.set(x0 + i, lineY + Math.round(Math.sin(i * 1.3) * 1.5), PAL.N1); };
  const w = clamp(st.w, 0, 4);
  scrib(px + 36, Math.round(Math.min(2, w) / 2 * 26));
  if (w > 2) scrib(px + 68, Math.round((w - 2) / 2 * 26));
  const nx = w > 2 ? px + 68 + Math.round((w - 2) / 2 * 26) : px + 36 + Math.round(Math.min(2, w) / 2 * 26);
  // his hand and pen (from the right: Mada's dark sleeve, the grey cuff), the nib on the line
  const h = placeHand(POSES.grip([-0.6, -0.65, -0.45], [0.25, -0.45, 0.85], 'R', 0.75), {s: 4.2, at: [nx + 16, lineY + 22], anchor: 'thumb', light: 'lobby', cuffRamp: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N4, PAL.G4]});
  sleeve(b, h.cuffEnd, [h.cuffEnd[0] + 200, h.cuffEnd[1] + 90], 20, 26, [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.G3]);
  line(nx, lineY, nx + 20, lineY + 22, b.ink(PAL.N1)); line(nx + 1, lineY, nx + 21, lineY + 22, b.ink(PAL.G2)); b.set(nx, lineY, PAL.W6);
  drawHand(b, h.hand, h.x, h.y);
  void f;
};

// ================================================================== 18.15: the reminder on his phone
/** [ECU] his phone face up on the table (dark, then lit with the reminder: `ELPPA · KEYNOTE · JUN 10`), his hand turning
 *  it over (`turn` 1, 2: face down); drawn at the phone's place for the lobby's wall screen in 19.01 (x 344..446) */
export const PHONE18 = {x: 352, y: 26, w: 88, h: 150};
export const phonePane = (b: Buf, f: number, st: {lit?: number; turn?: 0 | 1 | 2}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x * 3 + y * 7) % 61 < 2 ? PAL.D2 : (x + y) % 113 === 0 ? PAL.D4 : PAL.D3);
  glow(b, 60, 0, 300, 120, 1);
  // the minutes pad beside it, a pen across it
  fill(b, 150, 50, 120, 150, PAL.P2); fill(b, 150, 50, 120, 1, PAL.W9); for (let r = 0; r < 9; r++) fill(b, 160, 66 + r * 12, 96 - ((r * 23) % 30), 2, PAL.G5);
  line(140, 170, 214, 120, b.ink(PAL.N1)); line(140, 171, 214, 121, b.ink(PAL.N3));
  const P = PHONE18, turn = st.turn ?? 0;
  if (turn === 2) {
    fill(b, P.x + 4, P.y + P.h, P.w - 2, 4, PAL.D1);
    fill(b, P.x, P.y, P.w, P.h, PAL.G1); fill(b, P.x, P.y, P.w, 2, PAL.G3); ellipse(P.x + 16, P.y + 16, 8, 8, b.ink(PAL.N0)); ellipse(P.x + 16, P.y + 16, 5, 5, b.ink(PAL.N2));
    return;
  }
  const screen = (bb: Buf, r: {x: number; y: number; w: number; h: number}) => {
    fill(bb, r.x, r.y, r.w, r.h, PAL.N0); fill(bb, r.x + 4, r.y + 6, r.w - 8, r.h - 12, (st.lit ?? 0) > 0 ? PAL.N2 : PAL.N1);
    if ((st.lit ?? 0) > 0) {
      // the reminder: sc 8's invite, come due (the calendar's card in its own colour), legible
      const open = Math.min(1, (st.lit ?? 0) / 3), h = Math.max(3, Math.round(56 * open)), ty = r.y + 18 + Math.round((56 - h) / 2);
      fill(bb, r.x + 6, ty, r.w - 12, h, PAL.N3); fill(bb, r.x + 6, ty, r.w - 12, 2, PAL.C5);
      if (open >= 1) { pt(bb, 'ELPPA ·', r.x + 12, ty + 10, PAL.P2); pt(bb, 'KEYNOTE ·', r.x + 12, ty + 22, PAL.P2); pt(bb, 'JUN 10', r.x + 12, ty + 34, PAL.C7); }
    }
  };
  if (turn === 0) {
    fill(b, P.x + 4, P.y + P.h, P.w - 2, 4, PAL.D1);
    screen(b, P);
    if ((st.lit ?? 0) > 0) glow(b, P.x + P.w / 2, P.y + P.h / 2, 120, 110, 1, (x, y) => x >= P.x && x < P.x + P.w && y >= P.y && y < P.y + P.h);
    return;
  }
  // turning: his hand (from the right) lifting its near edge, the phone foreshortened on its long edge
  const face = {x: P.x + 26, y: P.y + 4, w: 36, h: P.h - 8};
  holdPhone(b, face, {side: 'R', grip: 'wrap', light: 'lobby', skinMap: skinDown(1), widthCm: 3.6, thumbAt: 0.2, sleeveTo: [560, 250],
    cuffRamp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.G5], sleeveRamp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5],
    drawPhone: (bb) => { fill(bb, face.x, face.y, face.w, face.h, PAL.G1); fill(bb, face.x, face.y, 4, face.h, PAL.C4); fill(bb, face.x + face.w - 2, face.y, 2, face.h, PAL.G3); }});
  void f;
};
void rect; void clamp; void pwrap; void tiny; void tinyWidth; void vramp;

// ================================================================== the split (SET-18), with a pane that can widen
/** the split: two panes and a 4 px divider. The left pane is `lw` wide (238 = the half) showing `left` from sxL; the
 *  right pane fills the rest showing `right` from sxR; `down` steps the waiting pane one palette rung. At lw >= 476 the
 *  left pane is the whole frame (the split has ended) */
export const splitAt = (b: Buf, left: Buf, right: Buf, o: {lw?: number; sxL?: number; sxR?: number; down?: 'left' | 'right' | null} = {}) => {
  const lw = Math.round(o.lw ?? 238), sxL = Math.round(o.sxL ?? 0), sxR = Math.round(o.sxR ?? 121);
  for (let y = 0; y < RH; y++) {
    for (let x = 0; x < Math.min(W, lw); x++) { const c = left.c[y * W + clamp(sxL + x, 0, W - 1)]; b.set(x, y, o.down === 'left' ? stepColor(c, -1) : c); }
    if (lw >= W) continue;
    for (let x = lw; x < Math.min(W, lw + 4); x++) b.set(x, y, PAL.N0);
    for (let x = lw + 4; x < W; x++) { const c = right.c[y * W + clamp(sxR + x - (lw + 4), 0, W - 1)]; b.set(x, y, o.down === 'right' ? stepColor(c, -1) : c); }
  }
};
