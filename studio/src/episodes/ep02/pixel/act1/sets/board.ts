// MR. MAS — Ep2 v1 · act1 · sc 4A YOU CAN SIT DOWN NOW (MAR 8, 2024, the boardroom, morning) and sc 4B THE BOOKING
// (his phone on the table): the drawings (the shots pass, 2026-10-09). The room is Ep1's boardroom (rooms/boardroom,
// imported read-only) on the séance's camera, the candles gone, by day: a morning grade over its lit layers, the window
// onto a pale morning sky (no reflection in it). The cast are Ep1's rigs (Terb with his sheet, Mada, Mas, Gerg, the
// civic extras as the new directors), the art pass's nameplates and XEL invite redrawn for the shots.
//   day(b, st)             [W] the table by day, from the séance's camera: TERB at the head (seat L) with his single
//                          sheet; MADA halfway down (C); OMIS (D) and two new directors (A, E); MAS standing behind the
//                          empty chair (B), or sitting in it; GERG at the back by the door with his laptop, standing
//   mada2S(b, f, st)       [2S] favouring MADA (Ep1's medium rig, perfectly still), Mas standing at the frame's left edge
//   masStill(b, f)         [MCU] Mas standing, Ep1's approved CU drawing (one silent, unchanging face) on this room by day
//   terbOTS(b, f, st)      [OTS] over Mas's shoulder onto TERB (Ep1's portrait, no helmet), who looks up from the sheet
//   plates(b, f, st)       [ECU] the nameplates clicking into their slots (art/props nameplatesECU)
//   phoneTable(b, f, st)   [ECU] his phone face up on the table beside his nameplate: it lights with an invite
//   invite(b, f, st)       4B [ECU] the calendar card (Ep1's invite look): XEL · LONG-FORM · MAR 18 · 2 HRS, a mic icon,
//                          his finger on Accept, the card settling into his calendar; the mic icon ends where 6.01's
//                          mic stands
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf, FAMILIES} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import {boardroomLayers, BR, END_SEAT_Y} from '../../../../../shared/pixel/rooms/boardroom';
import {overlay} from '../../../../../shared/pixel/rooms/setkit';
import {terbSheetRoom, TERB_SHEET_DEFAULT} from '../../../../../shared/pixel/cast/terb-sheet';
import {TERB_FOOT} from '../../../../../shared/pixel/cast/terb';
import {terbPortrait} from '../../../../../shared/pixel/cast/terb';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {drawMadaSeated, MADA_SEAT_DEFAULT} from '../../../../../shared/pixel/cast/mada';
import {drawMadaMedium, MADA_MEDIUM_DEFAULT} from '../../../../../shared/pixel/cast/mada-medium';
import {drawSenator} from '../../../../../shared/pixel/cast/civic-extras';
import {drawGergStand} from '../../../../../shared/pixel/cast/gerg-stand';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import {masCU} from '../../../../../shared/pixel/cast/mas-cu';
import {drawMasMedium} from '../../../../../shared/pixel/cast/mas-medium';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {drawMasStand2} from '../../art/cast/mas2';
import {nameplatesECU} from '../../art/props/ui';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, vramp} from '../../art/kit';
import {RH, W, glow, isSkin} from './common';
import {backHead} from './figures';

// ================================================================== the room by day
const PLATES0 = {A: null, B: null, C: null, D: null, E: null};
const PLATES1 = {A: 'NEW DIRECTOR', B: 'MAS MANALT', C: null, D: 'OMIS', E: 'NEW DIRECTOR'};
const LAY = new Map<string, ReturnType<typeof boardroomLayers>>();
/** the morning: every lit layer a rung or two up and warmer, the window a pale sky with the hills and the city soft */
const morning = (src: Buf, opaque: boolean) => {
  const b = new Buf(W, RH, 0);
  b.c.set(src.c);
  const Wn = BR.WINDOW;
  const G = FAMILIES.G, D = FAMILIES.D;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const c = b.c[y * W + x];
    if (!opaque && c === 0x1000000) continue;
    const inWin = opaque && x >= Wn.x0 && x < Wn.x1 && y >= Wn.y0 && y < Wn.y1;
    if (inWin) {
      // the morning beyond the glass: a pale sky, the hills soft, the city a lighter band (no reflection in it)
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
    // the night's cool rungs to the day's neutral greys (two rungs up), the warm ones a rung up; skin as it is
    const [fam, i] = fm;
    let v = c;
    // the window's light on the near half: a rung more toward the window, FEATHERED across x 170..270 in an ordered
    // dither (a hard edge at x 220 read as a compositing seam through the wall, the table and the floor)
    const near = x < 170 ? 1 : x >= 270 ? 0 : bayer(x, y) < (270 - x) / 100 ? 1 : 0;
    if (fam === 'N' || fam === 'C' || fam === 'F' || fam === 'U') v = G[Math.min(G.length - 1, i + 1 + near)];
    else if (fam === 'G') v = G[Math.min(G.length - 1, i + 2)];
    else if (fam === 'D' || fam === 'W' || fam === 'B') v = stepColor(c, 1 + near);
    void D;
    b.c[y * W + x] = v;
  }
  return b;
};
const dayLayers = (plates: Record<string, string | null>) => {
  const key = JSON.stringify(plates);
  let L = LAY.get(key);
  if (!L) {
    const n = boardroomLayers({f: 0, plates, rolodex: false, pendant: 0});
    L = {far: morning(n.far, true), mid: morning(n.mid, false), front: morning(n.front, false), fore: morning(n.fore, false)};
    LAY.set(key, L);
  }
  return L;
};
/** the seated directors' foot line (their legs under the table: the table's front layer hides them) */
const SEN_Y = 172;
export interface DaySt {
  f: number;
  /** Mas: standing behind the empty chair (B), sitting in it, or turned to Gerg as he sits */
  mas: 'stand' | 'sit' | 'glance';
  /** Terb: reading (eyes on the sheet), or looking up; his room-scale mouth */
  terb?: {read?: boolean; mouth?: 'rest' | 'open'};
  /** Gerg at the back: typing, or the laptop lifted an inch (the toast), his smile */
  gerg?: 'type' | 'lift';
  plates?: boolean;
  /** the table's sheet at the board's place (the arrival: the review where the board was), before Terb takes it up */
  sheet?: boolean;
}
export const day = (b: Buf, st: DaySt) => {
  const L = dayLayers(st.plates ? PLATES1 : PLATES0);
  overlay(b, L.far);
  // at the back wall: Mas standing behind his empty chair
  const gl = st.gerg === 'lift';
  // (beside his chair, between A and B: the far chairs' high backs would hide all but his head)
  if (st.mas === 'stand') drawMasStand2(b, 159, 152, {arm: 'down', light: 'room'});
  overlay(b, L.mid);
  // Gerg by the door with his laptop, in front of the end chair's high back (behind it, the back's day grade read as
  // see-through trousers); his own skin on his face (the laptop's green only on the screen's edge, never his mouth)
  drawGergStand(b, 450, 150 - (gl ? 1 : 0), {legs: 'stand', type: gl ? 0 : ((Math.floor(st.f / 3) % 3) as 0 | 1 | 2), look: gl ? 'up' : 'screen', mouth: 'rest', light: 'room'}, {flip: true});
  for (let y = 60; y < 104; y++) for (let x = 436; x < 476; x++) { const c = b.get(x, y), fm = familyOf(c); if (fm && fm[0] === 'L') b.set(x, y, PAL.S4); }
  // seated: the new directors (A, E), Mada (C) perfectly still, Omis (D); Mas at B once he sits
  drawSenator(b, BR.SEATS.A.x, SEN_Y, 1, 'sit');
  drawMadaSeated(b, BR.SEATS.C.x, 152, {...MADA_SEAT_DEFAULT, light: 'room'}, {spin: null});
  drawSenator(b, BR.SEATS.D.x, SEN_Y, 2, 'sit', {flip: true});
  drawSenator(b, BR.SEATS.E.x, SEN_Y, 0, 'sit', {flip: true});
  if (st.mas !== 'stand') drawMasSeated(b, BR.SEATS.B.x - 6, 134, {...MAS_SEATED_DEFAULT, arm: 'lap', head: st.mas === 'glance' ? 'host' : 'host', collars: 3, light: 'room'}, {flip: st.mas === 'glance' ? false : false});
  overlay(b, L.front);
  if (st.sheet) { poly([226, 158, 252, 156, 254, 166, 228, 168], b.ink(PAL.P2)); for (let r = 0; r < 3; r++) line(230, 159 + r * 3, 248, 158 + r * 3, b.ink(PAL.G5)); }
  // Terb at the head (seat L), seated, his single sheet up; no helmet and no extinguisher (no fire this morning: the
  // rig's sheet arm carries Ep1's extinguisher in the far hand, so its pixels are left out and his hand hangs empty)
  {
    const pose = {...TERB_SHEET_DEFAULT, legs: 'seat' as const, arm: (st.sheet ? 'none' : 'sheet') as 'none' | 'sheet', helmet: false, read: st.terb?.read ?? true, mouth: st.terb?.mouth ?? 'rest', light: 'room' as const};
    const img = terbSheetRoom(pose), x0 = BR.SEATS.L.x + 2 - TERB_FOOT[0], y0 = 194 - TERB_FOOT[1];
    // (the only red on him is the extinguisher's; its grey nozzle sits beside his far hand, seated: local x 8..30, y 50..90)
    const RED = new Set([PAL.R0, PAL.R1, PAL.R2, PAL.R3]), NOZ = new Set([PAL.G1, PAL.G6]);
    blitImg(b, img, x0, y0, {clip: (px, py) => { const i = px - x0, j = py - y0, v = img.c[j * img.w + i]; if (RED.has(v)) return false; return !(NOZ.has(v) && i >= 8 && i <= 30 && j >= 50 && j <= 90); }});
  }
  overlay(b, L.fore);
  // the morning's light through the window on the table's near half (a soft warm pool)
  glow(b, 150, 150, 170, 60, 1);
};

// ================================================================== 4A.02 the reading: Mada, then Mas
/** the room behind a medium (the far wall by day: the slats, the window's light from the left), soft */
const roomSoft = (() => {
  let c: Buf | null = null;
  return () => {
    if (c) return c;
    const b = new Buf(W, RH, PAL.G3);
    for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
      const t = x / W + (bayer(x, y) - 0.5) * 0.1;
      const slat = x > 200 && (x % 9) < 2;
      b.set(x, y, y > 150 ? (y === 151 ? PAL.D4 : (x * 3 + y) % 37 < 2 ? PAL.D2 : PAL.D3) : t < 0.35 ? (y < 120 ? (bayer(x, y) < 0.5 ? PAL.P2 : PAL.G6) : PAL.G5) : slat ? PAL.G3 : t < 0.6 ? PAL.G5 : PAL.G4);
    }
    c = b;
    return b;
  };
})();
/** [2S] favouring MADA: Ep1's medium rig (the poker face to the lens, arms folded, perfectly still), the table's edge
 *  across his waist; Mas standing at the frame's left edge, his hoodie's shoulder and arm (no face: the half lands on
 *  Mada) */
export const mada2S = (b: Buf, f: number) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  // MAS standing at the left (Ep1's medium rig, faced to the head of the table, his hands at his sides), a rung soft:
  // the half lands on Mada
  drawMasMedium(b, 34, 22, {head: '34', mouth: 'rest', lid: 0, look: 1, brow: 0, arm: 'down', light: 'warm'}, {flip: true, map: (c) => stepColor(c, -1)});
  // the chair back he stands behind (its high leather back across his waist)
  for (let y = 112; y < RH; y++) for (let x = 40; x < 116; x++) { const r = y < 122 ? Math.round(10 - Math.sqrt(Math.max(0, 100 - (122 - y) ** 2))) : 0; if (x < 40 + r || x >= 116 - r) continue; b.set(x, y, x < 44 || x > 111 || y < 115 ? PAL.N3 : PAL.N2); }
  // MADA seated, perfectly still, the table's edge across his waist
  drawMadaMedium(b, 268, 70, {...MADA_MEDIUM_DEFAULT, head: 'front', arm: 'fold', light: 'room', chair: true}, {spin: null, table: (bb) => { for (let y = 150; y < RH; y++) for (let x = 150; x < W; x++) bb.set(x, y, y === 150 ? PAL.D4 : (x * 3 + y) % 37 < 2 ? PAL.D2 : PAL.D3); }});
  void f;
};
/** [MCU] Mas standing: Ep1's approved CU face (no mouths, no blink: nothing on his surface) on this room by day */
export const masStill = (b: Buf, f: number) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  blitImg(b, masCU('tungsten'), 0, 0, {clip: (_x, y) => y < RH});
  void f;
};

// ================================================================== 4A.03 over Mas's shoulder onto Terb
/** [OTS] TERB at the head (his approved portrait, helmet off), lip-synced, looking up from the sheet; the window's
 *  morning behind him; MAS's back and shoulder in the right foreground (standing), which drop out of frame as he sits
 *  (`sit` 0..1) */
export const terbOTS = (b: Buf, st: {f: number; mouth?: Viseme; read?: boolean; sit?: number}) => {
  b.c.set(roomSoft().c.subarray(0, W * RH), 0);
  const img = terbPortrait({mouth: st.mouth ?? 'rest', lid: st.read ? 1 : 0, look: st.read ? 0 : 1, brow: 'level', helmet: false});
  putBustCut(b, img, 128, 48, RH, true);
  // the sheet in his hand at the frame's foot (its top edge, his fingers on it)
  poly([150, RH + 2, 160, 168, 238, 164, 244, RH + 2], b.ink(PAL.P2)); for (let r = 0; r < 4; r++) line(166, 174 + r * 6, 232, 171 + r * 6, b.ink(PAL.G5));
  for (const tx of [162, 236]) { fill(b, tx, 168, 6, 8, PAL.S4); fill(b, tx, 168, 6, 1, PAL.S5); }
  const sit = clamp(st.sit ?? 0, 0, 1);
  backHead(b, 404, 74 + Math.round(sit * 150), {hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3], skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S4], top: [PAL.G1, PAL.G2, PAL.G3], collar: 'hood', side: -1, rim: PAL.P1, scale: 1.3, cheek: 2});
};

// ================================================================== 4A.04 the nameplates; 4A.06 his phone
export const plates = (b: Buf, f: number, st: {n: number; click: boolean}) => { nameplatesECU(b, f, st); glow(b, 0, 0, 260, 90, 1); };
/** [ECU] his phone face up on the table beside his nameplate (its corner, MAS MANALT, top left), the morning on the wood;
 *  `lit` 0 dark .. 1 the screen up with the invite's toast (the mic icon, a line of its title) */
export const phoneTable = (b: Buf, f: number, st: {lit: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x * 3 + y * 7) % 61 < 2 ? PAL.D2 : (x + y) % 113 === 0 ? PAL.D4 : PAL.D3);
  glow(b, 60, 0, 300, 120, 1);
  // the nameplate's corner in its brass slot (top left)
  fill(b, -10, 14, 170, 38, PAL.P2); fill(b, -10, 14, 170, 1, PAL.W9); fill(b, 158, 14, 2, 38, PAL.P0); fill(b, -10, 52, 180, 8, PAL.W3); fill(b, -10, 52, 180, 2, PAL.W6);
  bpt(b, 'MANALT', 40, 26, PAL.N1);
  // the phone face up: its black slab, its rounded corners, its edge catching the window
  const px = 206, py = 64, pw2 = 128, ph = 132;
  fill(b, px + 6, py + ph, pw2 - 4, 4, PAL.D1);
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw2; x++) { const cr = (x < 6 || x >= pw2 - 6) && (y < 6 || y >= ph - 6) && Math.hypot(Math.min(x, pw2 - 1 - x) - 6, Math.min(y, ph - 1 - y) - 6) > 6; if (!cr) b.set(px + x, py + y, x < 2 || y < 2 ? PAL.G3 : PAL.N0); }
  if (st.lit > 0) {
    // the screen up: the lock screen's dark, the invite's toast at its top
    fill(b, px + 6, py + 8, pw2 - 12, ph - 16, PAL.N2);
    const ty = py + 18;
    fill(b, px + 12, ty, pw2 - 24, 40, PAL.N3); fill(b, px + 12, ty, pw2 - 24, 1, PAL.C5);
    fill(b, px + 20, ty + 10, 6, 12, PAL.G5); ellipse(px + 23, ty + 10, 3, 2, b.ink(PAL.G6)); fill(b, px + 22, ty + 22, 2, 4, PAL.G4); fill(b, px + 18, ty + 26, 10, 2, PAL.G4);
    pt(b, 'invite', px + 34, ty + 8, PAL.P2); pt(b, 'XEL ·', px + 34, ty + 20, PAL.N8);
    // its glow on the wood and the plate's edge
    glow(b, px + pw2 / 2, py + ph / 2, 120, 100, 1, (x, y) => x >= px && x < px + pw2 && y >= py && y < py + ph);
  }
  void f;
};

// ================================================================== 4B the calendar card
/** where 6.01's mic stands in the locked two-shot (art/sets/studio: the chrome's picture centre, the size-1 capsule) */
export const MIC_AT: [number, number] = [240, 102];
export interface InviteSt { f: number; accept: 0 | 1 | 2; settle: number }
/** [ECU] the phone on the table (filling the frame's middle), the calendar card with Ep1's invite look; `accept` 1 =
 *  his index finger down on Accept, 2 = accepted (the button lit); `settle` 0..1 the card shrinks into the calendar's
 *  MAR 18 cell, its mic icon ending on MIC_AT */
export const invite = (b: Buf, st: InviteSt) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x * 3 + y) % 53 < 2 ? PAL.D2 : PAL.D3);
  glow(b, 60, 0, 300, 120, 1);
  // the phone's face: its black bezel, the calendar app (a week strip at the top, the day's hours below)
  const P = {x: 140, y: 6, w: 200, h: 197};
  fill(b, P.x - 4, P.y - 4, P.w + 8, P.h + 8, PAL.N0); fill(b, P.x, P.y, P.w, P.h, PAL.N2);
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'], dnum = [18, 19, 20, 21, 22, 23, 24];
  // the week of MAR 18, its first cell (MON 18) at the mic's place
  const cw = 34, cx0 = 0, wy = 70;
  for (let i = 0; i < 7; i++) {
    const x = MIC_AT[0] - 16 + i * cw;
    if (x < P.x + 2 || x + cw - 2 > P.x + P.w) continue;
    fill(b, x, wy, cw - 2, 40, i === 0 && st.settle >= 1 ? PAL.C2 : PAL.N3);
    pt(b, days[i] + ' ' + dnum[i], x + 2, wy + 3, i === 0 ? PAL.P2 : PAL.N7);
  }
  void cx0;
  pt(b, 'MAR 2024', P.x + 10, P.y + 10, PAL.N8);
  for (let r = 0; r < 4; r++) { fill(b, P.x + 10, 124 + r * 18, P.w - 20, 1, PAL.N3); pt(b, `${9 + r * 2}`, P.x + 10, 116 + r * 18, PAL.N5); }
  // the card (Ep1's invite look), settling into the cell in three held steps
  const s = clamp(st.settle, 0, 1);
  if (s < 1) {
    const big = {x: P.x + 10, y: 30, w: P.w - 20, h: 100};
    const small = {x: MIC_AT[0] - 16, y: wy, w: cw - 2, h: 40};
    const lerp = (a: number, z: number) => Math.round(a + (z - a) * s);
    const r = {x: lerp(big.x, small.x), y: lerp(big.y, small.y), w: lerp(big.w, small.w), h: lerp(big.h, small.h)};
    fill(b, r.x - 1, r.y - 1, r.w + 2, r.h + 2, PAL.N0); fill(b, r.x, r.y, r.w, r.h, PAL.N3); fill(b, r.x, r.y, r.w, 2, PAL.C5);
    // shrinking, the card keeps what it is (never a blank box): its mic and the confirmation, then its mic and XEL
    if (s > 0 && s < 0.5) { micIcon(b, r.x + 12, r.y + 18); pt(b, 'XEL', r.x + 24, r.y + 8, PAL.P2); fill(b, r.x + 6, r.y + r.h - 20, r.w - 12, 14, PAL.C5); pt(b, 'Accepted', r.x + 10, r.y + r.h - 16, PAL.P2); }
    else if (s >= 0.5) { micIcon(b, r.x + (r.w >> 1), r.y + 18); pt(b, 'XEL', r.x + (r.w >> 1) - 8, r.y + r.h - 12, PAL.P2); }
    if (s === 0) {
      // the mic icon (left of the title), the title and its date, Accept and Decline
      micIcon(b, r.x + 16, r.y + 22);
      pt(b, 'XEL · LONG-FORM', r.x + 30, r.y + 12, PAL.P2);
      pt(b, 'MAR 18 · 2 HRS', r.x + 30, r.y + 26, PAL.N8);
      fill(b, r.x + 14, r.y + 62, 70, 22, st.accept ? PAL.C5 : PAL.C3); fill(b, r.x + 14, r.y + 62, 70, 1, PAL.C6);
      pt(b, st.accept === 2 ? 'Accepted' : 'Accept', r.x + 22 + (st.accept === 2 ? -2 : 4), r.y + 70, PAL.P2);
      fill(b, r.x + 96, r.y + 62, 70, 22, PAL.N2); pt(b, 'Decline', r.x + 110, r.y + 70, PAL.N6);
    }
  }
  // the mic icon in the MAR 18 cell once it has settled (where the next shot's mic stands)
  if (s >= 1) micIcon(b, MIC_AT[0], MIC_AT[1]);
  // his index finger on Accept (no cursor): from frame right, the sleeve out of frame
  if (st.accept === 1) {
    const tip: [number, number] = [P.x + 10 + 14 + 40, 30 + 62 + 12];
    const SL = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.W4];
    const h = placeHand(POSES.point([-0.7, -0.6, -0.38], [0.2, -0.6, 0.77]), {s: 5.6, at: tip, light: 'lobby', cuffRamp: SL, key: [0.3, -0.6, 0.7]});
    const cx = h.cuffEnd[0], cy = h.cuffEnd[1], dx = cx - h.wrist[0], dy = cy - h.wrist[1], Lh = Math.hypot(dx, dy) || 1;
    sleeve(b, [cx, cy], [cx + (dx / Lh) * 220, cy + (dy / Lh) * 220], 17, 20, [SL[0], SL[1], SL[3], SL[4], SL[6]]);
    drawHand(b, h.hand, h.x, h.y);
  }
  // the screen's glow on the table round the phone
  glow(b, P.x + P.w / 2, P.y + P.h / 2, 190, 140, 1, (x, y) => x >= P.x - 4 && x < P.x + P.w + 4 && y >= P.y - 4);
  void isSkin;
};
/** the mic icon (centred on cx, cy: the capsule's middle) */
const micIcon = (b: Buf, cx: number, cy: number) => {
  for (let j = -6; j <= 6; j++) for (let i = -4; i <= 4; i++) if (Math.hypot(i / 4.5, j / 6.5) < 1) b.set(cx + i, cy + j, i < -1 ? PAL.G6 : (i + j) % 3 === 0 ? PAL.G3 : PAL.G5);
  fill(b, cx - 5, cy + 1, 11, 1, PAL.N1);
  fill(b, cx, cy + 7, 1, 6, PAL.G4); fill(b, cx - 4, cy + 13, 9, 2, PAL.G4);
};
void rect; void vramp; void bpw; void pw; void END_SEAT_Y;
