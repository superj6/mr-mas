// MR. MAS — Ep2 v1 · act1 · sc 4: THE EMAIL SÉANCE's drawings (the shots pass, 2026-10-09). The room, the ghosts, the
// board, Move 37 and F2.3 are the art pass's (art/sets/seance.ts, art/sets/office2018.ts; art.md SET-02/03/04, §2.3),
// imported read-only; Ep1's rigs (the boardroom, Mas, Gerg, Nole, the Orb) are imported read-only. This file STAGES
// them per setup and draws what the art left to the shot pass. The axis (script-v1.md sc 4): MAS at the head of the
// table, screen-left (seat L); the foot, where NOLE lands, screen-right, under his ceiling hole; the shut door on the
// right wall. Seats (Ep1's boardroom): the EMPTY CHAIR is seat A, the far side's first seat beside Mas at the head
// ("an empty chair at the table's end": he signed it, he's just not here); GERG at seat B, one hand on the planchette,
// typing with the other; the three STAFFERS at C, D, E, holding hands; the Orb over the table like a chandelier.
//   room(b, st)          [W] the candle-lit table: its staging per beat (candles each lit or out, the flare, the
//                        planchette, the ceiling hole, Nole at the foot, the lamp, the ghosts drawn after the grade)
//   deskPOV(b, f, st)    4.01 [LOW·DESK] the laptop big in the foreground, the post on it legible, the table beyond
//   publishECU(b, f, st) 4.02 [ECU] his finger on the bare Publish (no cursor, no hover), the click
//   masLow(b, f, st)     [LOW·DESK] MAS at the head (Ep1's approved portrait, faced to the table, warm), his laptop's
//                        glow from below, the candles behind; lip-synced on his questions
//   boardHigh(b, f, st)  [HIGH] the board from above: the planchette on a letter / gliding, the word it spells, the
//                        held hands at the far edge, the ceiling's dust, three hands lifting, the Go corner
//   noleOTS(b, f, st)    [OTS] over Mas's shoulder (a silhouette, candle-rimmed) down the table to NOLE at the foot
//   noleMCU(b, f, st)    [MCU] NOLE (Ep1's portrait, warmed by the candles), his post lamp beside him, his phone
//   gergStaffer(b,f,st)  [M] GERG (Ep1's medium rig) and the STAFFER beside him; the empty chair at the left, soft
//   stafferMCU(b,f,st)   [MCU] the STAFFER, whispering behind her hand (her lines are off-mic: O.S. in the lock)
//   noles2S(b, f, st)    [2S] NOLE and GHOST-NOLE face to face: same jaw, same phone; the dated header held up
//   glassECU(b, f, st)   [ECU] Mas's hand on his glass: the slap's flames jump, the water doesn't move; the lift, the
//                        snuffed candle's smoke across the glass, the cut-paper sweep into 2018
//   masReverse(b,f,st)   4.34 [OTS] the reverse over Nole's shoulder, the candle in his hand, onto MAS candlelit
//   masBlow(b, f, st)    4.36 [MCU] Mas leans in and blows out the last candle
// Rules: native 480 x 270 (the room area rows 0..202), the master palette, whole-pixel moves, held drawings. Adult Mas
// never blinks. The planchette is a planchette (no pointer glyph); no cursor anywhere (P6). Alyi is only an author here
// (his name on the post's byline and on ghost 1's header), never in brass, stone, glass or reflection; in F2.3 he is a
// person, warm, cropped by his monitor's edge.
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import type {Img} from '../../../../../shared/pixel/figure';
import {boardroomLayers, BR, END_SEAT_Y} from '../../../../../shared/pixel/rooms/boardroom';
import {overlay} from '../../../../../shared/pixel/rooms/setkit';
import {drawBoardHead} from '../../../../../shared/pixel/rooms/boardroom-head';
import {noleImg, NOLE_BASE, NOLE_FOOT, nolePortraitImg} from '../../../../../shared/pixel/cast/nole';
import type {NolePose} from '../../../../../shared/pixel/cast/nole';
import {drawOrb, orbBob} from '../../../../../shared/pixel/cast/orb-medium';
import {drawMasSeated, MAS_SEATED_DEFAULT} from '../../../../../shared/pixel/cast/mas-seated';
import type {MasSeatedPose} from '../../../../../shared/pixel/cast/mas-seated';
import {masPortrait} from '../../../../../shared/pixel/cast/mas';
import type {MasMouth} from '../../../../../shared/pixel/cast/mas';
import {drawGergTable, gergTypeAt, gergPortrait} from '../../../../../shared/pixel/cast/gerg';
import {gergMedium} from '../../../../../shared/pixel/cast/gerg-medium';
import type {GergMediumState} from '../../../../../shared/pixel/cast/gerg-medium';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {drawOuija, OUIJA, OUIJA_LETTERS, drawGhost, drawGhostNole} from '../../art/sets/seance';
import type {GhostSpec} from '../../art/sets/seance';
import {seatedStaff, makeBust3, bustAnchors} from '../../art/cast/civic2';
import type {BustState, BustSpec3} from '../../art/cast/civic2';
import {sleeve, placeHand, drawHand, POSES} from '../../art/cast/hands2';
import type {V3} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, candleLight, layer, vramp} from '../../art/kit';
import type {Flame} from '../../art/kit';
import {RH, W, TR, compose, reframe, dimRoom, warm, isSkin, glow} from './common';
import {backHead} from './figures';
import type {BackHead} from './figures';

// ================================================================== the room (the wide)
/** where things stand in the wide (native) */
export const S4 = {
  mas: {x: BR.SEATS.L.x, seat: END_SEAT_Y - 2},
  /** his laptop at his end of the table (lid toward him: we see its back), its screen's light on him */
  laptop: {x: 84, y: 157},
  gerg: {x: BR.SEATS.B.x},
  staff: [BR.SEATS.C.x, BR.SEATS.D.x, BR.SEATS.E.x],
  empty: BR.SEATS.A.x,
  /** Nole at the foot of the table, under his hole (the door, x 374-414, stays clear of him) */
  nole: {x: 446, y: 190},
  hole: 446,
  /** his post lamp at the table's foot */
  lamp: {x: 400, y: 158},
  orb: {x: 240, y: 38},
};
export const CANDLES: Array<[number, number]> = [[150, 150], [176, 158], [232, 146], [300, 158], [330, 150], [392, 160]];
/** the candle nearest Nole (it snuffs at 4.27; he relights it and carries it to Mas's face; the last candle) */
export const NEAR_NOLE = 5;
/** the planchette's place on the board (board-local) at a letter, or the corner */
export const letterAt = (ch: string): [number, number] => OUIJA_LETTERS[ch] ?? [58, 10];
/** the night boardroom's lit layers (no plates, the pendant off): computed once */
let LAYERS: ReturnType<typeof boardroomLayers> | null = null;
const layers = () => LAYERS ?? (LAYERS = boardroomLayers({f: 0, plates: {A: null, B: null, C: null, D: null, E: null}, rolodex: false, pendant: 0}));

export interface NoleAt { x?: number; y?: number; pose?: Partial<NolePose>; flip?: boolean }
export interface Room4 {
  f: number;
  /** each candle out (true) */
  out?: boolean[];
  /** the flames up one step (the click), two (the slap) */
  flare?: 0 | 1 | 2;
  /** the planchette, board-local (null: off the board) */
  planchette?: [number, number] | null;
  hole?: 0 | 1 | 2 | 3;
  /** tiles raining (frames since the burst) */
  tiles?: number;
  lamp?: 'off' | 'on' | null;
  /** Mas at the head: his seated sprite's pose */
  mas?: Partial<MasSeatedPose> | null;
  /** Gerg at seat B: typing; his near hand on the planchette (true) */
  gerg?: {hand?: boolean; look?: 0 | 1} | null;
  /** the staffers' heads: 0 to the board, 1 toward the empty chair (seat A), 2 up (the ceiling) */
  staffLook?: 0 | 1 | 2;
  nole?: NoleAt | null;
  /** Nole on his cable (the cable from the hole down to his shoulders) */
  cable?: boolean;
  /** smoke from candles (index -> frames since it went out) */
  smoke?: Record<number, number>;
  /** a lit match in Nole's hand (4.33) */
  match?: boolean;
  /** the dark after the last candle: 0..1 (the room's own faint light) */
  dark?: boolean;
  /** drawn after the grade (the ghosts glow in the dark) */
  over?: (b: Buf) => void;
  /** Nole's candle (the last one) lit at a spot of its own (on the table in front of Mas, or in Nole's hand) */
  lastCandle?: {x: number; y: number; hand?: boolean} | null;
  /** the cable runs from his hole to this point (his shoulders) instead of straight down */
  cableTo?: [number, number] | null;
  /** one ceiling tile dropped back into the hole */
  patch?: boolean;
  /** the whole room shakes (the crash, the slam) */
  shake?: [number, number];
}
const flameH = (on: boolean, flare: number, f: number, x: number) => (!on ? 0 : (flare === 2 ? 11 : flare === 1 ? 7 : 4) + ((Math.floor(f / 4) + x) % 3 === 0 ? 1 : 0));
const candle = (b: Buf, x: number, y: number, on: boolean, flare: number, f: number) => {
  fill(b, x - 1, y - 6, 3, 7, PAL.P1); b.set(x - 1, y - 6, PAL.P2); fill(b, x - 2, y, 5, 1, PAL.W4);
  b.set(x, y - 7, PAL.N2);
  const h = flameH(on, flare, f, x);
  for (let j = 0; j < h; j++) { const w = flare && j < h * 0.55 ? 1 : 0; for (let i = -w; i <= w; i++) b.set(x + i, y - 7 - j, j < 2 ? PAL.W9 : j < h - 1 ? PAL.W7 : PAL.W6); }
};
/** smoke from a snuffed candle: a grey wisp rising and curling, thinning out over ~60 frames */
export const smokeWisp = (b: Buf, x: number, y: number, t: number, drift = 0.3) => {
  if (t < 0 || t > 70) return;
  const n = Math.min(26, Math.floor(t * 0.8));
  for (let j = 0; j < n; j++) {
    const yy = y - j, xx = x + Math.round(Math.sin((j + t * 0.5) / 4) * (1 + j / 8) + j * drift);
    const fade = (t > 40 ? (t - 40) / 30 : 0) + j / 40;
    if (bayer(xx, yy) < 0.8 - fade) b.set(xx, yy, j < 6 ? PAL.G4 : PAL.G3);
  }
};
const holeAt = (b: Buf, hx: number, st: 0 | 1 | 2 | 3, tiles: number, f: number) => {
  if (st >= 2) {
    // the ceiling's tiles, lit from the hole's light (warm near it), the tone carried across the whole frame so the lit
    // block doesn't float in black (the far tiles a rung or two above the dark, their grid faint)
    for (let x = 0; x < W; x++) for (let y = 0; y < 18; y++) {
      const lit = 1 - Math.min(1, Math.abs(x - hx) / 90), far = Math.abs(x - hx) / W;
      const base = lit > 0.55 ? PAL.W3 : lit > 0.25 ? PAL.W2 : lit > 0 ? PAL.W1 : (bayer(x, y) < 0.5 - far * 0.4 ? PAL.D1 : PAL.D0);
      b.set(x, y, y === 17 ? PAL.N0 : (x % 22 === 0 || y === 8) ? (lit > 0 ? PAL.W1 : PAL.N1) : base);
    }
    // the torn edge: broken tile in browns (its core dark, one warm step on the lip), never a row of flame tips
    for (let x = hx - 26; x < hx + 26; x++) {
      const d = 13 + Math.round(hash(x >> 1, 2, 9) * 7) - Math.round(Math.abs(x - hx) / 6);
      for (let y = 0; y < d; y++) b.set(x, y, y < d - 2 ? (hash(x, y, 3) < 0.06 ? PAL.U1 : PAL.N0) : y === d - 2 ? PAL.D3 : PAL.D2);
      if (hash(x, 7, 2) < 0.18) { b.set(x, d - 3, PAL.D3); b.set(x, d - 4, PAL.W3); }
    }
    poly([hx - 30, 15, hx - 18, 17, hx - 22, 33, hx - 34, 30], b.ink(PAL.W2));
    line(hx - 30, 15, hx - 34, 30, b.ink(PAL.W5)); line(hx - 34, 30, hx - 22, 33, b.ink(PAL.W1));
  }
  if (tiles >= 0 && tiles < 26) for (let k = 0; k < 8; k++) {
    const tx = hx - 26 + Math.floor(hash(k, 1, 4) * 52), ty = 14 + Math.floor((tiles + hash(k, 2, 4) * 6) * (5 + hash(k, 3, 4) * 3));
    if (ty > 186) { if (ty < 200) { fill(b, tx - 1, 188 + (k % 3), 7, 2, PAL.W2); } continue; }
    fill(b, tx, ty, 7, 4, PAL.W2); fill(b, tx, ty, 7, 1, PAL.W5);
  }
  void f;
};
export const room = (b: Buf, st: Room4) => {
  const L = layers();
  const out = st.out ?? [];
  const [dx, dy] = st.shake ?? [0, 0];
  overlay(b, L.far, dx, dy);
  // the shut door on the right wall (Ep1's frosted door: drawn by the far layer) stays as it is: he didn't use it
  overlay(b, L.mid, dx, dy);
  // ---- seated bodies: Gerg (B), the staffers (C, D, E), their hands joined; the empty chair (A) stays empty
  const lookSeed = st.staffLook ?? 0;
  const SK = [PAL.S2, PAL.S3, PAL.S4];
  // each staffer's own sleeve ramp, read off the sprite's torso (shadow side, mid, lit side)
  const tops: number[][] = [];
  S4.staff.forEach((sx, i) => {
    const flip = lookSeed === 1;
    blitImg(b, seatedStaff({seed: [3, 6, 9][i], pose: lookSeed === 2 ? 'turn' : 'watch'}), sx - 12 + dx, 112 + dy, {flip});
    const X = (lx: number) => sx - 12 + dx + (flip ? 25 - lx : lx);
    tops.push([b.get(X(7), 131 + dy), b.get(X(11), 131 + dy), b.get(X(16), 131 + dy)]);
    // the sprite's own hand in its lap goes (both hands are on the table now, joined): the torso over it
    for (let y = 134; y < 138; y++) for (let lx = 13; lx < 22; lx++) { const x = X(lx); if (isSkin(b.get(x, y + dy))) b.set(x, y + dy, tops[i][1]); }
  });
  overlay(b, L.front, dx, dy);
  // the joined hands: each arm bends at the elbow (the shoulder down to an elbow at the table's edge, the forearm out
  // along the table), the clasped hands resting low on the table between them, never a bar at shoulder height
  const bentArm = (i: number, side: -1 | 1, hand: [number, number]) => {
    const sx = S4.staff[i] + dx, sh: [number, number] = [sx + side * 5, 127 + dy];
    const el: [number, number] = [sx + side * 9, 137 + dy];
    const t = tops[i], ramp = [PAL.N0, t[0], t[1], t[2], t[2]];
    sleeve(b, sh, el, 1.9, 1.7, ramp, [-0.55, -0.83], {fold: false});
    sleeve(b, el, [hand[0] + dx, hand[1] + dy], 1.7, 1.4, ramp, [-0.55, -0.83], {fold: false});
  };
  const HK = [PAL.S3, PAL.S4, PAL.S5];
  const clasp = (x: number, y: number) => {
    // two hands meeting, fingers laced: the near one over the far one, a knuckle row lit by the candles
    fill(b, x - 3 + dx, y - 1 + dy, 7, 3, HK[1]); fill(b, x - 2 + dx, y - 2 + dy, 5, 1, HK[2]);
    b.set(x - 1 + dx, y + dy, HK[0]); b.set(x + 1 + dx, y + dy, HK[0]); b.set(x + dx, y + 2 + dy, HK[0]);
  };
  for (let k = 0; k < 2; k++) { const mx = (S4.staff[k] + S4.staff[k + 1]) >> 1; bentArm(k, 1, [mx - 2, 141]); bentArm(k + 1, -1, [mx + 2, 141]); clasp(mx, 141); }
  for (const [i, d] of [[0, -1], [2, 1]] as Array<[number, -1 | 1]>) {
    const hx = S4.staff[i] + d * 16;
    bentArm(i, d, [hx, 141]);
    fill(b, hx - 2 + dx, 140 + dy, 4, 2, HK[1]); fill(b, hx - 1 + dx, 139 + dy, 3, 1, HK[2]);
  }
  // ---- on the table: the board, the candles, Mas's laptop, Gerg at his laptop with a hand on the planchette, the lamp
  drawOuija(b, OUIJA.x + dx, OUIJA.y + dy, {go: false, planchette: st.planchette === undefined ? letterAt('A') : st.planchette});
  CANDLES.forEach(([cx, cy], i) => { if (!(st.lastCandle && i === NEAR_NOLE)) candle(b, cx + dx, cy + dy, !out[i], st.flare ?? 0, st.f); });
  if (st.lastCandle && !st.lastCandle.hand) candle(b, st.lastCandle.x + dx, st.lastCandle.y + dy, true, 0, st.f);
  if (st.gerg !== null) {
    const g = st.gerg ?? {hand: true};
    drawGergTable(b, S4.gerg.x - 26 + dx, 101 + dy, {type: gergTypeAt(st.f), lid: 0, look: g.look ?? 0, mouth: 'rest', flick: (Math.floor(st.f / 9) % 2) as 0 | 1}, st.f, {capsFrom: 1e9});
    const [px, py] = st.planchette ?? letterAt('A');
    const hx = OUIJA.x + px - 5 + dx, hy = OUIJA.y + py - 3 + dy;
    // his near shoulder (screen right of him), the elbow down at the table's edge
    const sh: [number, number] = [S4.gerg.x + dx, 126 + dy];
    // only while the planchette is within his reach (the board's left end): his real arm, shoulder, elbow, hand
    if (g.hand !== false && Math.hypot(hx - sh[0], hy - sh[1]) < 40) {
      const el: [number, number] = [sh[0] + 3 + Math.round((hx - sh[0]) * 0.15), 140 + dy];
      // his own jacket's tones, read off his torso (a dark sleeve on the dark table read as no arm at all)
      const gc = (x: number) => b.get(S4.gerg.x + x + dx, 129 + dy);
      const R = [PAL.N0, gc(-8), gc(-4), gc(0), stepColor(gc(0), 1)];
      sleeve(b, sh, el, 2.2, 2, R, [-0.55, -0.83], {fold: false});
      sleeve(b, el, [hx - 2, hy - 1], 2, 1.6, R, [-0.55, -0.83], {fold: false});
      // the hand flat on the planchette's rim, the fingers forward onto it
      fill(b, hx - 3, hy - 2, 5, 3, PAL.S4); fill(b, hx - 3, hy - 2, 5, 1, PAL.S5); b.set(hx + 2, hy - 1, PAL.S4); b.set(hx + 2, hy, PAL.S3);
    }
  }
  // Mas's laptop at the head: its lid toward him (its back to us, three-quarter), the screen's edge lit
  { const {x, y} = S4.laptop; poly([x - 2 + dx, y + dy, x + 12 + dx, y - 2 + dy, x + 14 + dx, y + 1 + dy, x + dx, y + 3 + dy], b.ink(PAL.G2)); poly([x + dx, y + dy, x - 4 + dx, y - 14 + dy, x - 2 + dx, y - 15 + dy, x + 2 + dx, y - 1 + dy], b.ink(PAL.N1)); line(x - 4 + dx, y - 14 + dy, x + dx, y + dy, b.ink(PAL.C5)); }
  if (st.lamp) { const {x, y} = S4.lamp; fill(b, x + dx, y - 16 + dy, 2, 16, PAL.G3); fill(b, x - 5 + dx, y - 20 + dy, 12, 5, PAL.G4); fill(b, x - 5 + dx, y - 20 + dy, 12, 1, PAL.G5); fill(b, x - 3 + dx, y + dy, 8, 1, PAL.G2); if (st.lamp === 'on') fill(b, x - 4 + dx, y - 15 + dy, 10, 1, PAL.W8); }
  // ---- Mas at the head (seat L), seated, facing the table
  if (st.mas !== null) drawMasSeated(b, S4.mas.x + 2 + dx, S4.mas.seat + dy, {...MAS_SEATED_DEFAULT, arm: 'hold', head: 'down', collars: 3, light: 'room', ...(st.mas ?? {})});
  overlay(b, L.fore, dx, dy);
  // ---- Nole at the foot (standing, or on his cable)
  if (st.nole) {
    const n = st.nole, nx = (n.x ?? S4.nole.x) + dx, ny = (n.y ?? S4.nole.y) + dy;
    if (st.cable && !st.cableTo) for (let y = 0; y < ny - 82; y++) { b.set(S4.hole + dx, y, PAL.N0); b.set(S4.hole + 1 + dx, y, PAL.G3); }
    if (st.cable && st.cableTo) { line(S4.hole + dx, 0, st.cableTo[0] + dx, st.cableTo[1] + dy, b.ink(PAL.N0)); line(S4.hole + 1 + dx, 0, st.cableTo[0] + 1 + dx, st.cableTo[1] + dy, b.ink(PAL.G3)); }
    blitImg(b, noleImg({...NOLE_BASE, ...(n.pose ?? {})}), nx - (n.flip ? 68 - 1 - NOLE_FOOT[0] : NOLE_FOOT[0]), ny - NOLE_FOOT[1], {flip: n.flip, clip: (_x, y) => y < RH});
    if (st.lastCandle?.hand) { const {x, y} = st.lastCandle; fill(b, x - 1 + dx, y - 6 + dy, 3, 7, PAL.P1); b.set(x + dx, y - 7 + dy, PAL.N2); }
    if (st.match) { const mx = nx - 20, my = ny - 52; fill(b, mx, my, 1, 5, PAL.D3); b.set(mx, my - 1, PAL.W9); b.set(mx, my - 2, PAL.W7); b.set(mx - 1, my - 1, PAL.W6); }
  }
  // ---- the grade: the candles (and the lamp) are the only light
  const flames: Flame[] = CANDLES.map(([x, y], i) => ({x: x + dx, y: y - 9 + dy, r: (st.flare === 2 ? 130 : st.flare === 1 ? 112 : 96), on: !out[i] && !(st.lastCandle && i === NEAR_NOLE)}));
  if (st.lastCandle) flames.push({x: st.lastCandle.x + dx, y: st.lastCandle.y - 9 + dy, r: 110});
  if (st.lamp === 'on') flames.push({x: S4.lamp.x + dx, y: S4.lamp.y - 14 + dy, r: 70});
  if (st.match && st.nole) flames.push({x: (st.nole.x ?? S4.nole.x) - 20 + dx, y: (st.nole.y ?? S4.nole.y) - 54 + dy, r: 40});
  candleLight(b, flames, {amb: st.dark ? 0.04 : 0.2});
  // his laptop's screen lights Mas at the head: a cool rim on the planes facing it (his face's front edge, the hand at
  // the glass), never the whole face
  if (st.mas !== null && !st.dark) {
    const lx = S4.laptop.x + dx - 18, ly = S4.laptop.y + dy - 20;
    const snap = new Int32Array(b.c);
    // the rim is ONE soft step (the mixed-light skin), and only on the flat planes (the brow, the cheek, the jaw): a
    // row whose edge juts past the rows above and below (the nose, the lips) keeps its own skin, so the profile never
    // reads as a white outline
    const edgeX = (y: number) => { for (let x = lx + 17; x >= lx - 30; x--) if (x > 0 && y >= 0 && y < RH && isSkin(snap[y * W + x])) return x; return -1; };
    const SOFT: Record<number, number> = {[PAL.S0]: PAL.X0, [PAL.S1]: PAL.X1, [PAL.S2]: PAL.X2, [PAL.S3]: PAL.X3, [PAL.S4]: PAL.X3};
    for (let y = ly - 26; y < ly + 26; y++) for (let x = lx - 30; x < lx + 18; x++) {
      if (x < 1 || y < 0 || y >= RH) continue;
      const c = snap[y * W + x];
      if (isSkin(c) && !isSkin(snap[y * W + x + 1])) {
        const e = edgeX(y), up = edgeX(y - 1), dn = edgeX(y + 1);
        if (x === e && (x > up && x > dn)) continue;
        b.set(x, y, SOFT[c] ?? c);
      } else if (!isSkin(c) && Math.hypot((x - lx) / 30, (y - ly) / 26) < 0.6 && bayer(x, y) < 0.3) b.set(x, y, stepColor(c, 1));
    }
  }
  // GERG's face behind his laptop: warmed a step from the candles (his own skin, not the screen's cyan), the sockets
  // lifted out of black, so the laptop's light reads as an edge, never a skull's half-mask
  if (st.gerg !== null && !st.dark) {
    const WK: Record<number, number> = {[PAL.K0]: PAL.S1, [PAL.K1]: PAL.S2, [PAL.K2]: PAL.S3, [PAL.K3]: PAL.S4, [PAL.K4]: PAL.S4, [PAL.K5]: PAL.S5, [PAL.S0]: PAL.S1, [PAL.S1]: PAL.S2};
    for (let y = 98 + dy; y < 126 + dy; y++) for (let x = S4.gerg.x - 22 + dx; x < S4.gerg.x + 4 + dx; x++) { const c = b.get(x, y); const v = WK[c]; if (v !== undefined) b.set(x, y, v); }
  }
  // the flames themselves over the grade (pure flame colours), the smoke
  if (st.lastCandle) { const {x, y} = st.lastCandle; for (let j = 0; j < 4; j++) b.set(x + dx, y - 7 - j + dy, j < 2 ? PAL.W9 : PAL.W7); }
  CANDLES.forEach(([cx, cy], i) => { if (st.lastCandle && i === NEAR_NOLE) return; const h = flameH(!out[i], st.flare ?? 0, st.f, cx); for (let j = 0; j < h; j++) { const w = (st.flare ?? 0) && j < h * 0.55 ? 1 : 0; for (let q = -w; q <= w; q++) b.set(cx + q + dx, cy - 7 - j + dy, j < 2 ? PAL.W9 : j < h - 1 ? PAL.W7 : PAL.W6); } });
  for (const [i, t] of Object.entries(st.smoke ?? {})) { const [cx, cy] = CANDLES[+i]; smokeWisp(b, cx + dx, cy - 8 + dy, t); }
  // the ceiling hole over the foot of the table (lit from below), the tiles
  if (st.hole) holeAt(b, S4.hole + dx, st.hole, st.tiles ?? -1, st.f);
  if (st.patch) { const hx = S4.hole + dx, d = st.dark ? 2 : 0; fill(b, hx - 12, 0, 24, 15, stepColor(PAL.W2, -d)); fill(b, hx - 12, 14, 24, 1, stepColor(PAL.W4, -d)); fill(b, hx - 12, 0, 1, 15, stepColor(PAL.W1, -d)); }
  // THE ORB as the chandelier over the table
  if (!st.dark) { line(S4.orb.x + dx, 0, S4.orb.x + dx, 24 + orbBob(st.f, true), b.ink(PAL.N3)); drawOrb(b, S4.orb.x + dx, S4.orb.y + dy, 12, {look: [0, 0.6], aperture: 0.5}); }
  st.over?.(b);
};

// ================================================================== the ghosts in the wide
/** ghost 1 (Alyi's email, Jan 2016) rising from the board's centre: its rise 0..1 (it grows up out of the table) */
export const ghost1 = (b: Buf, rise: number, o: {x?: number; y?: number} = {}) => {
  if (rise <= 0) return;
  const x = o.x ?? 150, y = o.y ?? 34;
  const t = layer(W, 270);
  drawGhost(t, x, y, {kind: 'thread', header: 'FROM: ALYI · JAN 2016', body: '"…IT WILL MAKE SENSE TO START BEING LESS OPEN."'});
  const top = Math.round(150 - (150 - (y - 6)) * Math.min(1, rise));
  for (let yy = 0; yy < RH; yy++) for (let xx = 0; xx < W; xx++) { const c = t.c[yy * W + xx]; if (c !== TR && yy >= top) b.set(xx, yy, c); }
};
/** the 2016 GHOST-NOLE beneath it (his RE: Yup), translucent; mouth 0..2 */
export const ghostNole16 = (b: Buf, rise: number, mouth: 0 | 1 | 2, o: {x?: number; y?: number; header?: boolean} = {}) => {
  if (rise <= 0) return;
  const t = layer(W, 270);
  const fx = o.x ?? 330, fy = o.y ?? 186;
  drawGhostNole(t, fx, fy, {pose: {arm: 'phone', mouth}, header: o.header === false ? undefined : 'RE: · 2016', quote: o.header === false ? undefined : '"YUP."', headerAt: [fx - 34, 76]});
  const top = Math.round(RH - (RH - 60) * Math.min(1, rise));
  for (let yy = 0; yy < RH; yy++) for (let xx = 0; xx < W; xx++) { const c = t.c[yy * W + xx]; if (c !== TR && yy >= top) b.set(xx, yy, c); }
};

// ================================================================== MAS at the head, from desk height
/** the dark behind Mas at the head of the table: the boardroom's night window soft (no reflection in it), two
 *  candles' bokeh, the table's edge in the foreground lit by his screen */
const masLowBg = (() => {
  let cache: Buf | null = null;
  return () => {
    if (cache) return cache;
    const b = new Buf(W, RH, PAL.N0);
    for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const t = y / RH + (bayer(x, y) - 0.5) * 0.12; b.set(x, y, t < 0.55 ? (x < 230 ? PAL.N1 : PAL.N0) : PAL.N0); }
    // the window's mullions, out of focus (the Valley a few soft points: no reflection in the glass)
    for (const mx of [64, 150, 236]) for (let y = 0; y < 120; y++) if (bayer(mx, y) < 0.6) { b.set(mx, y, PAL.N2); b.set(mx + 1, y, PAL.N2); }
    for (let k = 0; k < 40; k++) { const x = Math.floor(hash(k, 1, 7) * 230), y = 70 + Math.floor(hash(k, 2, 7) * 40); if (hash(k, 3, 7) < 0.5) b.set(x, y, hash(k, 4, 7) < 0.3 ? PAL.W5 : PAL.W3); }
    cache = b;
    return b;
  };
})();
const bokeh = (b: Buf, cx: number, cy: number, r: number, col: number, edge: number) => {
  for (let y = cy - r - 1; y <= cy + r + 1; y++) for (let x = cx - r - 1; x <= cx + r + 1; x++) { const d = Math.hypot(x - cx, y - cy); if (d <= r) b.set(x, y, d > r - 1 ? edge : col); else if (d <= r + 1 && bayer(x, y) < 0.4) b.set(x, y, edge); }
};
export interface MasLow { mouth?: MasMouth; look?: -1 | 0 | 1; head?: '34' | 'front'; brow?: 0 | 1; flare?: 0 | 1 | 2; f: number; lid?: 0 | 1 }
/** the table at desk height running away from him to the right: the candles standing on it (crisp: in the table's
 *  plane), the staffers' joined hands beyond (soft, two rungs down), the dark window behind him */
const MASLOW_C: Array<[number, number]> = [[300, 172], [370, 160], [446, 168]];
/** [LOW·DESK] Mas at the head of the table: Ep1's approved conversation portrait (112 x 136) faced to the table
 *  (screen-right), the candles warm on his near side, his laptop's screen a cool key from below (its lid's back in the
 *  foreground below his chin) */
export const masLow = (b: Buf, st: MasLow) => {
  b.c.set(masLowBg().c.subarray(0, W * RH), 0);
  const fl = st.flare ?? 0;
  // the staff beyond (soft): heads and shoulders, their hands joined over the table's far edge
  for (const [hx, seed] of [[318, 1], [392, 2], [462, 3]] as Array<[number, number]>) {
    for (let j = 0; j < 46; j++) for (let i = -16; i <= 16; i++) { const head = Math.hypot(i / 8, (j - 9) / 10) < 1, body = j > 17 && Math.abs(i) < 15 - (j < 22 ? 22 - j : 0); if ((head || body) && bayer(hx + i, 98 + j) < 0.85) b.set(hx + i, 98 + j, head ? (seed % 2 ? PAL.D1 : PAL.N2) : PAL.N1); }
  }
  for (const mx of [355, 427]) { fill(b, mx - 22, 140, 44, 3, PAL.N2); fill(b, mx - 3, 138, 6, 5, PAL.D1); }
  // the table top running away to the right (warm walnut), its near edge across the frame's foot
  for (let y = 150; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, y === 150 ? PAL.D3 : (x + Math.floor(y * 1.4)) % 29 < 2 ? PAL.D1 : PAL.D2);
  for (const [cx, cy] of MASLOW_C) { fill(b, cx - 2, cy - 12, 5, 12, PAL.P1); b.set(cx - 2, cy - 12, PAL.P2); fill(b, cx - 3, cy, 7, 1, PAL.W4); }
  candleLight(b, MASLOW_C.map(([x, y]) => ({x, y: y - 16, r: 150 + fl * 30})).concat([{x: 250, y: 120, r: 130}]), {amb: 0.22});
  const img = masPortrait({mouth: st.mouth ?? 'rest', lid: st.lid ?? 0, look: st.look ?? 1, brow: st.brow ?? 0, light: 'warm', head: st.head ?? '34'});
  const X = 64, Y = 34;
  putBustCut(b, img, X, Y, RH, true);
  // the hoodie a rung down where the candles don't reach (the back of him, toward frame left)
  for (let y = Y; y < RH; y++) for (let x = X; x < X + 40; x++) { const c = b.get(x, y); if (!isSkin(c) && familyOf(c)?.[0] === 'G') b.set(x, y, stepColor(c, -1)); }
  // his laptop: the lid's back toward us below his chin (dark, its top edge lit by the screen)
  poly([150, RH + 2, 160, 160, 236, 154, 232, RH + 2], b.ink(PAL.N1)); line(160, 160, 236, 154, b.ink(PAL.C5)); line(160, 161, 236, 155, b.ink(PAL.C3));
  // the screen's cool light under his chin and along the front planes of his face
  for (let y = Y + 50; y < Y + 104 && y < RH; y++) for (let x = X + 40; x < X + 112; x++) { const c = b.get(x, y); if (isSkin(c) && (!isSkin(b.get(x, y + 2)) || !isSkin(b.get(x + 2, y)))) b.set(x, y, [PAL.K2, PAL.K3, PAL.K3, PAL.K4][Math.min(3, Math.max(0, (familyOf(c)?.[1] ?? 2) - 1))]); }
  for (const [cx, cy] of MASLOW_C) { const h = (fl === 2 ? 10 : fl === 1 ? 7 : 4) + ((Math.floor(st.f / 4) + cx) % 3 === 0 ? 1 : 0); for (let j = 0; j < h; j++) { b.set(cx, cy - 13 - j, j < 2 ? PAL.W9 : j < h - 1 ? PAL.W7 : PAL.W6); if (fl && j < h * 0.5) { b.set(cx - 1, cy - 13 - j, PAL.W7); b.set(cx + 1, cy - 13 - j, PAL.W7); } } }
};

// ================================================================== the board from above (HIGH)
/** the board close (art ouijaECU's geometry, drawn here so the planchette can glide and the word can spell): the wood,
 *  three rows of letters in the big face, the plain brass-rimmed planchette (a window, no pointer), the spelled word
 *  along the near edge */
const HROWS = ['>>> A B C D E F G H', 'I J K L M N O P Q R', 'S T U V W X Y Z >>>'];
const HPOS: Record<string, [number, number]> = (() => {
  const pos: Record<string, [number, number]> = {};
  HROWS.forEach((r, j) => { let cx = 240 - Math.round(bpw(r) / 2); for (const ch of r.split(' ')) { if (!pos[ch]) pos[ch] = [cx + Math.round(bpw(ch) / 2), 40 + j * 40 + 7]; cx += bpw(ch) + bpw(' '); } });
  return pos;
})();
/** the board-close position of a letter (the planchette's window centred on it) */
export const hpos = (ch: string): [number, number] => HPOS[ch] ?? [240, 100];
const WOODS = new Map<string, Buf>();
/** the board on the table from above; (ox, oy) moves the camera (the board drawn that many pixels right / down) */
const wood = (ox = 0, oy = 0) => {
  const key = `${ox},${oy}`;
  const hit = WOODS.get(key); if (hit) return hit;
  const b = new Buf(W, RH, PAL.D3);
  // the table (dark walnut) and the board lying on it: a lighter maple panel with a burnt border and its corners
  for (let Y = 0; Y < RH; Y++) for (let X = 0; X < W; X++) {
    const x = X - ox, y = Y - oy;
    const inB = x >= 70 && x < 410 && y >= 14 && y < 196;
    b.set(X, Y, inB ? (((x + Math.floor(y * 0.3)) % 37 + 37) % 37 < 2 ? PAL.D3 : (((x * 7 + y * 3) % 89) + 89) % 89 === 0 ? PAL.W5 : PAL.D4) : ((((x * 2 + y) % 23) + 23) % 23 < 2 ? PAL.D1 : PAL.D2));
  }
  const S = (x: number, y: number, c: number) => b.set(x + ox, y + oy, c);
  for (let x = 70; x < 410; x++) { S(x, 14, PAL.W4); S(x, 195, PAL.D1); S(x, 20, PAL.D2); S(x, 189, PAL.D2); }
  for (let y = 14; y < 196; y++) { S(70, y, PAL.W3); S(409, y, PAL.D1); S(76, y, PAL.D2); S(403, y, PAL.D2); }
  for (const [cx, cy] of [[84, 30], [396, 30], [84, 180], [396, 180]]) { ellipse(cx + ox, cy + oy, 4, 4, b.ink(PAL.D2)); S(cx, cy, PAL.W4); }
  HROWS.forEach((r, j) => bpt(b, r, 240 - Math.round(bpw(r) / 2) + ox, 40 + j * 40 + oy, PAL.P1));
  WOODS.set(key, b);
  return b;
};
const planchetteAt = (b: Buf, px: number, py: number) => {
  for (let j = -34; j <= 34; j++) for (let i = -40; i <= 40; i++) {
    const d = Math.hypot(i / 40, (j + (j > 0 ? j * 0.3 : 0)) / 34);
    if (d < 1) b.set(px + i, py + j, d > 0.86 ? (j < 0 ? PAL.W7 : PAL.W5) : d > 0.8 ? PAL.W3 : d > 0.42 ? (i < 0 ? PAL.D4 : PAL.D3) : b.get(px + i, py + j) === PAL.P1 ? PAL.P2 : PAL.C1);
  }
  ellipse(px, py, 16, 14, b.ink(PAL.W5));
  for (let j = -13; j <= 13; j++) for (let i = -15; i <= 15; i++) if (Math.hypot(i / 15, j / 13) < 0.92) { const c = b.get(px + i, py + j); b.set(px + i, py + j, c === PAL.W5 ? PAL.D3 : c); }
  // its shadow on the wood (lower right), so it reads as a thing lying on the board
  for (let j = 30; j < 38; j++) for (let i = -30; i < 34; i++) if (Math.hypot(i / 34, (j - 30) / 8) < 1 && bayer(px + i + 6, py + j) < 0.5) { const c = b.get(px + i + 6, py + j); if (c === PAL.D3 || c === PAL.D2) b.set(px + i + 6, py + j, PAL.D1); }
};
export interface HighSt {
  f: number;
  /** the planchette's centre (board-close coords); or a letter */
  at?: [number, number] | string;
  /** the word spelled so far, shown along the near edge in his cyan (the board's answer) */
  word?: string;
  /** the N's slide in NOPE: 0..1 (the N lifted out of OPEN's end and carried to the front) */
  nSlide?: number;
  /** the staffers' joined hands at the far edge (4.06: perfectly still) */
  held?: boolean;
  /** dust sifting down from the ceiling (frames since a knock, and how loud: 1..3) */
  dust?: Array<[number, number]>;
  /** the three hands on the planchette: 0 none, 1 resting, 2 lifted (an inch off it), 3 gone */
  hands?: 0 | 1 | 2 | 3;
  /** the corner turning to a Go board: 0..3 (held steps) */
  go?: number;
  /** the flames at the board's edges (two candles' light from the top corners) */
  flare?: number;
  /** the inbox chime: the >>> glows */
  chime?: boolean;
  /** the board's tremor (a pixel, on the loudest knock) */
  shake?: number;
  /** the camera moved over the board (the board drawn this many pixels right / down): 4.12's closer look at the
   *  planchette, so the three hands on it sit in the frame */
  cam?: [number, number];
}
const goCorner = (b: Buf, n: number) => {
  // the board's lower right corner (the third row's end) turning to cut paper, a Go board's grid, its first stones
  if (n <= 0) return;
  const x0 = 300, y0 = 120, x1 = 480, y1 = RH;
  const r = [0, 60, 120, 999][Math.min(3, n)];
  for (let y = y0 - 10; y < y1; y++) for (let x = x0 - 10; x < x1; x++) {
    const d = Math.hypot(x - x1, y - y1);
    if (d > r + 60) continue;
    const inside = d < r + 40 - (bayer(x, y) * 14);
    if (!inside) continue;
    const gx = (x - 312) % 14, gy = (y - 132) % 14;
    b.set(x, y, gx === 0 || gy === 0 ? PAL.D2 : (hash(x >> 2, y >> 2, 4) < 0.08 ? PAL.W4 : PAL.W5));
  }
  if (n >= 3) for (const [sx, sy, w] of [[340, 160, 0], [382, 146, 1], [424, 174, 0], [438, 132, 1]] as Array<[number, number, number]>) { ellipse(sx, sy, 6, 6, b.ink(w ? PAL.P2 : PAL.N1)); b.set(sx - 2, sy - 3, w ? PAL.W9 : PAL.G3); }
};
export const boardHigh = (b: Buf, st: HighSt) => {
  const [ox, oy] = st.cam ?? [0, 0];
  b.c.set(wood(ox, oy).c.subarray(0, W * RH), 0);
  const sk = st.shake ? 1 : 0;
  if (sk) reframe(b, 0, 1);
  if (st.chime) for (const ch of ['>>>']) { const [x, y] = hpos(ch); for (let yy = y - 9; yy < y + 7; yy++) for (let xx = x - 24; xx < x + 24; xx++) if (b.get(xx, yy) === PAL.P1) b.set(xx, yy, PAL.C8); }
  goCorner(b, st.go ?? 0);
  const at0 = typeof st.at === 'string' ? hpos(st.at) : st.at ?? hpos('A');
  const at: [number, number] = [at0[0] + ox, at0[1] + oy];
  planchetteAt(b, at[0], at[1] + sk);
  const under = Object.entries(HPOS).find(([, p]) => Math.abs(p[0] - at0[0]) < 3 && Math.abs(p[1] - at0[1]) < 3);
  if (under) bpt(b, under[0], at[0] - Math.round(bpw(under[0]) / 2), at[1] - 7 + sk, PAL.P2);
  // the held hands at the far edge: two pairs of hands joined, their sleeves running out of the top of the frame
  if (st.held) for (const [hx, side] of [[110, 1], [370, -1]] as Array<[number, number]>) {
    const hy = 14;
    sleeve(b, [hx - 50 * side, -10], [hx - 9 * side, hy + 6], 12, 10, [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4]);
    sleeve(b, [hx + 50 * side, -10], [hx + 9 * side, hy + 6], 12, 10, [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4]);
    for (let j = 0; j < 16; j++) for (let i = -13; i <= 13; i++) if (Math.hypot(i / 13, (j - 8) / 8) < 1) b.set(hx + i, hy + j, j < 3 ? PAL.S5 : i < -5 ? PAL.S3 : PAL.S4);
    for (let i = -9; i <= 9; i += 6) line(hx + i, hy + 4, hx + i + 1, hy + 13, b.ink(PAL.S2));
    for (let j = 16; j < 22; j++) for (let i = -12; i <= 12; i++) if (bayer(hx + i, hy + j) < 0.5) { const c = b.get(hx + i, hy + j); b.set(hx + i, hy + j, stepColor(c, -1)); }
  }
  // three hands on the planchette (Mas's, ghost-Nole's, Gerg's): from three sides, then lifted, then gone
  const H = st.hands ?? 0;
  if (H === 1 || H === 2) {
    const lift = H === 2 ? 1 : 0;
    const [px, py] = at;
    const HS: Array<{at: [number, number]; fwd: V3; side: 'L' | 'R'; to: [number, number]; ramp: number[]; cuff: number[]; ghost?: boolean}> = [
      {at: [px - 38 - lift * 6, py - 2 - lift * 2], fwd: [0.85, -0.3, -0.35], side: 'L', to: [px - 260, py + 90], ramp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4], cuff: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.P1]},
      // GHOST-NOLE's, from above, the whole hand in frame, its fingertips resting on the planchette's top rim
      {at: [px + 16 + lift * 4, py - 30 - lift * 8], fwd: [-0.55, 0.75, -0.35], side: 'R', to: [px + 110, py - 170], ramp: [PAL.C1, PAL.C4, PAL.C6, PAL.C7, PAL.C8], cuff: [PAL.C1, PAL.C4, PAL.C6, PAL.C6, PAL.C7, PAL.C8, PAL.C9], ghost: true},
      // GERG's, from the right, its fingertips on the planchette's right rim
      {at: [px + 40 + lift * 6, py + 6 - lift * 4], fwd: [-0.88, -0.2, -0.35], side: 'R', to: [px + 190, py + 260], ramp: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5], cuff: [PAL.N0, PAL.G4, PAL.G5, PAL.P1, PAL.P1, PAL.P2, PAL.P2]},
    ];
    for (const q of HS) {
      const t = q.ghost ? layer(W, 270) : b;
      const map = q.ghost ? (c: number) => { const L = lightness(c); return L > 0.6 ? PAL.C9 : L > 0.45 ? PAL.C8 : L > 0.3 ? PAL.C7 : PAL.C6; } : undefined;
      // lifted: the hand's shadow stays on the wood a few pixels off its fingertips (the gap that says "off")
      if (lift && !q.ghost) for (let j = -4; j < 4; j++) for (let i = -10; i < 10; i++) if (bayer(q.at[0] + i + 6, q.at[1] + j + 8) < 0.5) { const c = b.get(q.at[0] + i + 6, q.at[1] + j + 8); if (c === PAL.D3 || c === PAL.D2) b.set(q.at[0] + i + 6, q.at[1] + j + 8, PAL.D1); }
      const h = placeHand(POSES.open(q.fwd, [0.05, -0.25, 0.97], q.side), {s: 6, at: q.at, anchor: 'middle', light: 'lobby', key: [-0.2, -0.5, 0.85], cuffRamp: q.cuff, skinMap: map});
      // the sleeve on the forearm's own line (the wrist's axis carried on out of frame: no kink behind the cuff)
      const ax = h.cuffEnd[0] - h.wrist[0], ay = h.cuffEnd[1] - h.wrist[1], aL = Math.hypot(ax, ay) || 1;
      sleeve(t, h.cuffEnd, [h.cuffEnd[0] + (ax / aL) * 320, h.cuffEnd[1] + (ay / aL) * 320], 15, 19, q.ramp);
      void q.to;
      drawHand(t, h.hand, h.x, h.y);
      if (q.ghost) for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const v = t.c[y * W + x]; if (v === TR) continue; if (((x + y) & 1) === 0) b.set(x, y, v); else b.set(x, y, stepColor(b.get(x, y), 1)); }
    }
  }
  // the dust from the ceiling: grains sifting down in held steps, more for each louder knock
  for (const [t, loud] of st.dust ?? []) {
    if (t < 0 || t > 30) continue;
    for (let k = 0; k < 10 * loud; k++) { const x = Math.floor(hash(k, loud, 11) * W), y = Math.floor(hash(k, loud, 12) * 60) + Math.floor(t / 2) * 6; if (y < RH) b.set(x, y, t > 20 ? PAL.D4 : PAL.P0); }
  }
  // the candles' warm light from the top corners (they flare on the click)
  glow(b, 0, 0, 220 + (st.flare ?? 0) * 30, 160, 1);
  glow(b, W, 0, 200 + (st.flare ?? 0) * 30, 150, 1);
  // the word spelled, along the near edge, a letter at a time (the board's answer)
  if (st.word !== undefined) {
    const w = st.word, wx = 240 - Math.round(bpw(w.split('').join(' ')) / 2), wy = 180;
    fill(b, wx - 8, wy - 4, bpw(w.split('').join(' ')) + 16, 22, PAL.N0);
    if (st.nSlide !== undefined && w === 'OPEN') {
      // NOPE: the N lifted off the end and carried to the front in one held glide
      const s = clamp(st.nSlide, 0, 1);
      const rest = 'OPE', step = bpw('O ');
      const nx = Math.round(wx + 3 * step - s * 3 * step), ny = wy - Math.round(Math.sin(s * Math.PI) * 10);
      const shift = s >= 1 ? step : 0;
      bpt(b, rest.split('').join(' '), wx + shift, wy, PAL.C7);
      bpt(b, 'N', nx, ny, s > 0 && s < 1 ? PAL.C9 : PAL.C7);
    } else bpt(b, w.split('').join(' '), wx, wy, PAL.C7);
  }
};

// ================================================================== 4.01 the desk POV: the post on his laptop
/** the editor on his laptop's screen at desk height (title, byline, the first paragraph's bars, the bare Publish), the
 *  candle-lit table beyond it and above it (the room a rung down); the screen lights the table's edge cyan */
export const SCREEN = {x: 12, y: 92, w: 236, h: 111};
export const deskPOV = (b: Buf, f: number, st: {pressed?: boolean} = {}) => {
  room(b, {f, mas: null, planchette: letterAt('A')});
  reframe(b, -24, 22);
  dimRoom(b, 1);
  const {x, y, w, h} = SCREEN;
  // the lid: its bezel, the screen
  fill(b, x - 6, y - 6, w + 12, h + 12, PAL.N0); fill(b, x - 6, y - 6, w + 12, 1, PAL.G2);
  fill(b, x, y, w, h, PAL.P2);
  fill(b, x, y, w, 9, PAL.G5); for (let i = 0; i < 3; i++) ellipse(x + 8 + i * 8, y + 4, 2, 2, b.ink(PAL.G3));
  bpt(b, 'NOPEAI AND NOLE', x + 12, y + 18, PAL.N1);
  pt(b, '… · ALYI · … · MAS', x + 13, y + 40, PAL.G2);
  for (let r = 0; r < 5; r++) fill(b, x + 13, y + 56 + r * 8, 196 - (r * 37) % 70, 3, PAL.G6);
  fill(b, x + w - 70, y + h - 12, 62, 12, st.pressed ? PAL.C2 : PAL.C3); fill(b, x + w - 70, y + h - 12, 62, 1, PAL.C5); pt(b, 'Publish', x + w - 58, y + h - 9, PAL.P2);
  // the screen's light: the table's near edge to its right, and the planchette's brass catching it
  glow(b, x + w + 10, y + 60, 60, 40, 1, (xx) => xx < x + w + 6);
};
/** 4.02 [ECU] the editor close, its title and byline at the top, the bare Publish (no cursor, no hover) and his index
 *  finger over it, his grey sleeve from frame right (art/sets/alyioffice publishECU's hand, Mas's ramps); `press` = the
 *  click (the finger down on it, the button a rung darker), `lift` = the finger back up after */
export const publishECU = (b: Buf, f: number, st: {press?: boolean; flare?: number} = {}) => {
  vramp(b, 0, 0, W, RH, [PAL.N1, PAL.N2, PAL.N2]);
  fill(b, 30, 14, 420, 176, PAL.N3);
  bpt(b, 'NOPEAI AND NOLE', 52, 24, PAL.P2);
  pt(b, '… · ALYI · … · MAS', 53, 46, PAL.N7);
  for (let r = 0; r < 3; r++) fill(b, 53, 62 + r * 9, 300 - r * 46, 3, PAL.N5);
  fill(b, 120, 98, 220, 58, st.press ? PAL.C2 : PAL.C3); fill(b, 120, 98, 220, 2, st.press ? PAL.C3 : PAL.C5); fill(b, 120, 154, 220, 2, PAL.C1);
  bpt(b, 'Publish', 230 - Math.round(bpw('Publish') / 2), 119, PAL.P2);
  const SL = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.W4];
  const tip: [number, number] = st.press ? [214, 114] : [214, 86];
  const h = placeHand(POSES.point([-0.78, 0.5, -0.38], [0.25, -0.6, 0.76]), {s: 6.4, at: tip, light: 'lobby', cuffRamp: SL, key: [0.3, -0.6, 0.7]});
  const cx = h.cuffEnd[0], cy = h.cuffEnd[1], dx = cx - h.wrist[0], dy = cy - h.wrist[1], L = Math.hypot(dx, dy) || 1;
  sleeve(b, [cx, cy], [cx + (dx / L) * 220, cy + (dy / L) * 220], 19, 22, [SL[0], SL[1], SL[3], SL[4], SL[6]]);
  if (!st.press) for (let j = 0; j < h.hand.img.h; j++) for (let i = 0; i < h.hand.img.w; i++) if (h.hand.img.c[j * h.hand.img.w + i] >= 0) { const X = h.x + i - 4, Y = h.y + j + 9; if (Y > 98 && Y < 154 && X > 120 && X < 340 && bayer(X, Y) < 0.5) b.set(X, Y, stepColor(b.get(X, Y), -1)); }
  drawHand(b, h.hand, h.x, h.y);
  // the candles' warm light at the screen's edges (they flare one step on the click)
  const fl = st.flare ?? 0;
  if (fl) { glow(b, 0, RH, 140 + fl * 40, 120, fl); glow(b, W, RH, 140 + fl * 40, 120, fl); }
  void f;
};

// ================================================================== the OTS down the table to the foot (Nole's end)
/** down the table from the head to the FOOT: the foot's wall (Ep1's boardroom's walnut slats, dark), the ceiling with
 *  Nole's hole over the far end, the table receding (walnut, a trapezoid), the candles standing down it; re-lit by them */
const FT = {farY: 126, farX0: 156, farX1: 396, nearX0: -150, nearX1: 640};
const OTS_CANDLES: Array<[number, number, number]> = [[200, 136, 0], [350, 134, 1], [168, 158, 2], [394, 154, 3], [112, 190, 4], [446, 186, 5]];
let OTS_PLATE: Buf | null = null;
const otsPlate = () => {
  if (OTS_PLATE) return OTS_PLATE;
  const b = new Buf(W, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    if (y < 16) { b.set(x, y, y === 15 ? PAL.N2 : PAL.N1); continue; }
    const slat = (x % 12) < 2;
    b.set(x, y, slat ? PAL.D0 : (x * 7 + y * 3) % 53 === 0 ? PAL.D2 : PAL.D1);
  }
  // the skirting, the floor beyond the table's end
  fill(b, 0, 112, W, 3, PAL.D2); for (let y = 115; y < FT.farY; y++) fill(b, 0, y, W, 1, PAL.N1);
  // the table: walnut, its far edge lit, its grain toward us
  for (let y = FT.farY; y < RH; y++) {
    const t = (y - FT.farY) / (RH - FT.farY);
    const x0 = Math.round(FT.farX0 + (FT.nearX0 - FT.farX0) * t), x1 = Math.round(FT.farX1 + (FT.nearX1 - FT.farX1) * t);
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) { const g = Math.floor((x - 268) / (1 + t * 3)); b.set(x, y, y === FT.farY ? PAL.D4 : (g % 7 === 0) ? PAL.D2 : PAL.D3); }
  }
  OTS_PLATE = b;
  return b;
};
const MAS_BACK: BackHead = {hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3], skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S4], top: [PAL.N1, PAL.G1, PAL.G2], collar: 'hood', side: 1, rim: PAL.W5};
const NOLE_BACK: BackHead = {hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2], skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S4], top: [PAL.N0, PAL.N1, PAL.N2], collar: 'tee', side: -1, rim: PAL.W5};
/** Mas from behind at the frame's left edge (the OTS foreground), turned a hair toward the foot */
export const masShoulder = (b: Buf, x: number, y: number, o: {cheek?: number} = {}) => backHead(b, x, y, {...MAS_BACK, scale: 1.25, cheek: o.cheek ?? 2});
export const noleShoulder = (b: Buf, x: number, y: number) => backHead(b, x, y, {...NOLE_BACK, scale: 1.3, cheek: 1});
export interface OtsSt {
  f: number;
  /** Nole at the foot (his portrait, warmed): mouth 0..4, the phone's jab, a dip of the head; null = not there */
  nole?: {mouth?: 0 | 1 | 2 | 3 | 4; jab?: 0 | 1 | 2; dip?: number; brow?: 0 | 1; x?: number; brush?: boolean} | null;
  /** the 2016 ghost behind him and its Yup (ghost-Nole) */
  ghosts16?: boolean;
  /** ghost 3 (Dec 2018, ghost-Nole in a hoodie with the 0% header) drifting into Mas's eyeline: x of his feet */
  ghost3?: {x: number; mouth: 0 | 1 | 2} | null;
  /** the cow (4.14: Nole at the cow) */
  cow?: boolean;
  out?: boolean[];
  lamp?: 'off' | 'on' | null;
  turn?: 0 | 1;
}
/** [OTS] over Mas's shoulder down the table to the foot: Nole standing at the far end behind the end chair (his
 *  portrait, bust-cut by the table), the candles down the table, the ghosts hanging over it */
export const noleOTS = (b: Buf, st: OtsSt) => {
  b.c.set(otsPlate().c.subarray(0, W * RH), 0);
  const out = st.out ?? [];
  // the hole in the ceiling over the foot (Nole's), its torn lip lit from below, the cable hanging out of it
  for (let x = 254; x < 330; x++) { const d = 12 + Math.round(hash(x >> 1, 4, 9) * 5) - Math.round(Math.abs(x - 292) / 7); for (let y = 0; y < d; y++) b.set(x, y, y < d - 2 ? PAL.N0 : y === d - 2 ? PAL.W5 : PAL.W3); }
  // Nole at the foot, standing behind its chair, the table's far end cutting him at the waist
  if (st.nole) {
    const n = st.nole;
    const img = nolePortraitImg({mouth: n.mouth ?? 0, jab: n.jab ?? 0, blink: 0, brow: n.brow ?? 0, dip: n.dip ?? 0});
    const nx = n.x ?? 238, ny = -2;
    blitImg(b, img, nx, ny, {map: warm, clip: (_x, y) => y < FT.farY});
    // brushing a tile off his shoulder: a chip of ceiling tile on his shoulder, then gone
    if (n.brush) { fill(b, nx + 74, ny + 98, 6, 3, PAL.W3); fill(b, nx + 74, ny + 98, 6, 1, PAL.W5); }
  }
  // the candles standing down the table (their flames after the grade)
  for (const [cx, cy, i] of OTS_CANDLES) { if (out[i]) { b.set(cx, cy - 8, PAL.N2); } fill(b, cx - 1, cy - 7, 3, 7, PAL.P1); fill(b, cx - 2, cy, 5, 1, PAL.W4); }
  if (st.lamp) { fill(b, 384, 104, 2, 20, PAL.G3); fill(b, 377, 98, 16, 6, PAL.G4); fill(b, 380, 124, 8, 1, PAL.G2); if (st.lamp === 'on') fill(b, 378, 104, 14, 1, PAL.W8); }
  const flames: Flame[] = OTS_CANDLES.map(([x, y, i]) => ({x, y: y - 9, r: 120, on: !out[i]}));
  if (st.lamp === 'on') flames.push({x: 385, y: 104, r: 110});
  candleLight(b, flames, {amb: 0.22});
  // a key on Nole's face from the candles before him (one step), after the grade
  if (st.nole) { const nx = st.nole.x ?? 238; for (let y = 0; y < FT.farY; y++) for (let x = nx; x < nx + 112; x++) { const c = b.get(x, y); if (isSkin(c)) b.set(x, y, stepColor(c, 1)); } }
  for (const [cx, cy, i] of OTS_CANDLES) if (!out[i]) for (let j = 0; j < 4 + ((Math.floor(st.f / 4) + cx) % 3 === 0 ? 1 : 0); j++) b.set(cx, cy - 7 - j, j < 2 ? PAL.W9 : PAL.W7);
  // the ghosts over the table (after the grade: they carry their own light)
  if (st.ghosts16) {
    const t = layer(W, 270);
    drawGhost(t, 8, 24 + ([0, 0, -1, -1, 0, 0, 1, 1][Math.floor(st.f / 9) % 8]), {kind: 'thread', header: 'FROM: ALYI · JAN 2016', body: '"…IT WILL MAKE SENSE TO START BEING LESS OPEN."'});
    for (let i = 0; i < W * RH; i++) if (t.c[i] !== TR) b.c[i] = t.c[i];
    const g = layer(W, 270);
    drawGhostNole(g, 410, 196, {pose: {arm: 'phone', mouth: 0}, header: 'RE: · 2016', quote: '"YUP."', headerAt: [392, 74], flip: true});
    for (let i = 0; i < W * RH; i++) if (g.c[i] !== TR) b.c[i] = g.c[i];
  }
  if (st.cow) { const t = layer(W, 270); drawGhost(t, 104, 70, {kind: 'cow', header: '2018'}); for (let i = 0; i < W * RH; i++) if (t.c[i] !== TR) b.c[i] = t.c[i]; }
  if (st.ghost3) {
    const g = layer(W, 270);
    drawGhostNole(g, st.ghost3.x, 196, {hoodie: true, pose: {arm: 'point', mouth: st.ghost3.mouth}, flip: true});
    for (let i = 0; i < W * RH; i++) if (g.c[i] !== TR) b.c[i] = g.c[i];
  }
  masShoulder(b, 30, 96, {cheek: st.turn ? 4 : 2});
  // ghost 3's header over everything, wrapped wider (three lines of the record, not four) so the whole block, its
  // closing "NOT 1%." included, sits clear of the back of Mas's head and of Nole's
  if (st.ghost3) ghostHeaderAt(b, 6, 2, 'DEC 2018', '"…RELEVANT TO MINDDEEP/ELGOOG WITHOUT A DRAMATIC CHANGE IN EXECUTION AND RESOURCES IS 0%. NOT 1%."', 240);
};
/** a ghost's dated header and the record's words under it (art/sets/seance's ghostHeader, with its wrap width as a
 *  parameter), in the spirit screen */
const ghostHeaderAt = (b: Buf, x: number, y: number, s: string, quote: string, wrap: number) => {
  const words = quote.split(' '), lines = [s];
  let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (pw(t) > wrap && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur);
  const w = Math.max(...lines.map((l) => pw(l))) + 8, h = lines.length * 10 + 2;
  const gp = (X: number, Y: number, c: number) => { if (((X + Y) & 1) === 0) b.set(X, Y, c); else b.set(X, Y, stepColor(b.get(X, Y), 1)); };
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) gp(x + i, y + j, j === 0 || j === h - 1 ? PAL.C7 : PAL.C4);
  lines.forEach((l, i) => pt(b, l, x + 4, y + 2 + i * 10, i === 0 ? PAL.C9 : PAL.C8));
};

// ================================================================== NOLE close (MCU), the post lamp, the phone
/** the dark behind Nole at the foot: the slats soft, a candle's bokeh low left, his lamp (when on) at frame right */
const noleBg = (lamp: boolean) => {
  const b = new Buf(W, RH, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const slat = (x % 14) < 2; const t = y / RH + (bayer(x, y) - 0.5) * 0.14; b.set(x, y, t > 0.7 ? PAL.N0 : slat ? PAL.N0 : x > 240 ? PAL.D0 : PAL.N1); }
  // the two candles' warm pool on the wall behind them (they stand on the table at lower left: noleFore)
  glow(b, 70, 150, 90, 60, 1);
  // the post lamp's pool on the wall (its body is drawn in front: noleFore)
  if (lamp) glow(b, 408, 110, 130, 100, 2);
  return b;
};
const NOLE_TABLE_Y = 182;
const NOLE_CANDLES: Array<[number, number]> = [[58, NOLE_TABLE_Y + 4], [118, NOLE_TABLE_Y + 9]];
/** what stands in front of Nole at the foot of the table: the table's edge across the frame's foot (walnut, its far
 *  edge lit), two candles standing on it at lower left (their bodies, wicks and flames: never a flame in the air), and
 *  his post lamp at frame right: a weighted base on the table, a jointed arm (two struts and their hinge), the cone
 *  shade angled down at him, dark until it clicks on */
const noleFore = (b: Buf, lamp: boolean | null, f: number) => {
  for (let y = NOLE_TABLE_Y; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, y === NOLE_TABLE_Y ? PAL.D3 : y === NOLE_TABLE_Y + 1 ? PAL.D2 : (x * 3 + y * 5) % 47 < 2 ? PAL.D0 : PAL.D1);
  for (const [cx, cy] of NOLE_CANDLES) {
    const top = cy - 16;
    fill(b, cx - 2, top, 5, cy - top, PAL.P1); fill(b, cx + 1, top, 2, cy - top, PAL.P0); b.set(cx - 2, top, PAL.P2); b.set(cx - 1, top, PAL.P2);
    fill(b, cx - 3, cy, 7, 1, PAL.D3); b.set(cx, top - 1, PAL.N2);
    glow(b, cx, top - 6, 26, 20, 1, (x, y) => Math.abs(x - cx) < 3 && y > top - 1);
    const h = 5 + ((Math.floor(f / 4) + cx) % 3 === 0 ? 1 : 0);
    for (let j = 0; j < h; j++) { b.set(cx, top - 2 - j, j < 2 ? PAL.W9 : j < h - 1 ? PAL.W7 : PAL.W6); if (j > 0 && j < 3) { b.set(cx - 1, top - 2 - j, PAL.W6); b.set(cx + 1, top - 2 - j, PAL.W6); } }
  }
  if (lamp === null) return;
  const lc = lamp ? [PAL.G2, PAL.G4, PAL.G6] : [PAL.N1, PAL.N2, PAL.N4];
  // the base: a weighted disc on the table
  ellipse(438, NOLE_TABLE_Y + 3, 16, 4, b.ink(lc[0])); line(423, NOLE_TABLE_Y + 2, 452, NOLE_TABLE_Y + 2, b.ink(lc[1]));
  // the lower strut up to the hinge, the upper strut forward over him to the shade, two springs along them
  const strut = (x0: number, y0: number, x1: number, y1: number) => { line(x0, y0, x1, y1, b.ink(lc[0])); line(x0 + 1, y0, x1 + 1, y1, b.ink(lc[1])); line(x0 + 2, y0, x1 + 2, y1, b.ink(lc[0])); };
  strut(436, NOLE_TABLE_Y, 452, 122);
  strut(452, 122, 414, 92);
  for (let t = 0.2; t < 0.8; t += 0.15) { const x = Math.round(436 + 16 * t), y = Math.round(NOLE_TABLE_Y - 60 * t); b.set(x + 3, y, lc[2]); }
  ellipse(453, 122, 3, 3, b.ink(lc[1])); b.set(453, 122, lc[0]);
  ellipse(415, 92, 2, 2, b.ink(lc[1]));
  // the cone shade, its mouth angled down toward him (screen-left and down); the bulb inside when it's on
  poly([414, 84, 424, 92, 404, 120, 386, 104], b.ink(lc[0]));
  line(414, 84, 386, 104, b.ink(lc[2])); line(424, 92, 404, 120, b.ink(lc[0]));
  line(386, 104, 404, 120, b.ink(lamp ? PAL.W7 : lc[1]));
  if (lamp) { line(388, 105, 403, 118, b.ink(PAL.W9)); ellipse(395, 110, 3, 3, b.ink(PAL.W8)); b.set(395, 110, PAL.W9); }
};
const NOLE_BG = new Map<string, Buf>();
export interface NoleMcuSt { f?: number; mouth?: 0 | 1 | 2 | 3 | 4; jab?: 0 | 1 | 2; dip?: number; brow?: 0 | 1; blink?: 0 | 1 | 2; lamp?: boolean; screen?: 'post'; x?: number; y?: number; drift?: number; down?: boolean }
/** [MCU] NOLE: Ep1's conversation portrait (his phone hand up, jabbing toward camera-left: the table, Mas), warmed by
 *  the candles, a face light one step; `drift` moves the frame in whole pixels (4.26's slow drift in) */
export const noleMCU = (b: Buf, st: NoleMcuSt) => {
  const key = st.lamp ? 'on' : 'off';
  let bg = NOLE_BG.get(key); if (!bg) { bg = noleBg(!!st.lamp); NOLE_BG.set(key, bg); }
  b.c.set(bg.c.subarray(0, W * RH), 0);
  const img = nolePortraitImg({mouth: st.mouth ?? 0, jab: st.jab ?? 0, blink: st.blink ?? 0, brow: st.brow ?? 0, dip: (st.dip ?? 0) + (st.down ? 2 : 0), screen: st.screen});
  const dr = st.drift ?? 0;
  const X = (st.x ?? 236) - dr, Y = (st.y ?? 46) - Math.round(dr / 2);
  putBustCut(b, img as Img, X, Y, RH, false);
  for (let y = 0; y < RH; y++) for (let x = X; x < X + 112; x++) { const c = b.get(x, y); const w2 = warm(c); if (w2 !== c) b.set(x, y, w2); }
  // the candles' light on his face (from frame left, low): a key one step, the rim on that side
  for (let y = Y + 20; y < Y + 90 && y < RH; y++) for (let x = X + 20; x < X + 90; x++) { const c = b.get(x, y); if (isSkin(c) && !isSkin(b.get(x - 1, y))) b.set(x, y, stepColor(c, 1)); }
  if (st.lamp) for (let y = Y + 10; y < Y + 100 && y < RH; y++) for (let x = X + 60; x < X + 112; x++) { const c = b.get(x, y); if (isSkin(c) && !isSkin(b.get(x + 1, y))) b.set(x, y, PAL.W8); }
  noleFore(b, !!st.lamp, st.f ?? 0);
};

// ================================================================== GERG and the STAFFER beside him (MEDIUM)
/** the staffer beside Gerg: a young engineer, a dark bun, a muted green sweater; her own sculpted head (art/cast's
 *  makeBust3), faced camera-left (toward Gerg, the empty chair, the stone) */
const STAFFER_SPEC: BustSpec3 = {
  head: {yaw: 26, at: [57, 58], scale: 0.98, cranium: [19, 23, 21], cheekW: 15, cheekY: 6, jawW: 11, jawY: 17, jawH: 10, chinY: 30, chinW: 4.5, chinZ: 11, chinH: 4, cheekbone: 0.8, full: 0.7, brow: 0.4,
    nose: {tipY: 11, proj: 5.5, wing: 3, bridge: 1.5, tip: 2.4, hook: -0.3}, mouthY: 20, lips: 1.2, eyeX: 8.2, neck: {r: 7}, hair: {style: 'bun', thick: 3, line: -17, side: -1},
    skin: SKIN.medium, hairRamp: HAIR.dark, back: {skin: PAL.S3, hair: PAL.B2}},
  face: {eye: 'lash', eyeW: 8, eyeH: 2, brow: 'arched', browCol: PAL.B0, mouthW: 8, lip: {line: PAL.U3, lower: PAL.U4}},
  torso: {kind: 'pantsuit'},
  ramps: {skin: SKIN.medium, hair: HAIR.dark, suit: [PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.U4], shirt: [PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3, PAL.U4]},
  backRamp: {skin: PAL.S3, hair: PAL.B2, suit: PAL.U2},
};
export const stafferBust = makeBust3<BustState>(STAFFER_SPEC);
let GS_BG: Buf | null = null;
/** the far side of the table behind them: the window's dark, the EMPTY CHAIR (seat A) at the left, soft, a candle's
 *  warm edge on its high back (a chair, no one in it), the table's edge across the foot of the frame */
const gsBg = () => {
  if (GS_BG) return GS_BG;
  // (graded by the caller: candleLight after the room, before the faces)
  const b = new Buf(W, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const t = y / RH + (bayer(x, y) - 0.5) * 0.12; b.set(x, y, t < 0.62 ? (x < 230 ? PAL.N1 : PAL.N0) : PAL.N0); }
  // the window's mullions, dark (no reflection in the glass)
  for (const mx of [30, 116, 202]) for (let y = 0; y < 128; y++) if (bayer(mx, y) < 0.5) b.set(mx, y, PAL.N2);
  // the empty chair: a leather high back (rounded top, its seams), the seat's front edge, soft; nobody in it
  const cx = 70, top = 40;
  for (let y = top; y < 150; y++) for (let x = cx - 30; x < cx + 30; x++) {
    const t = y - top, r = t < 14 ? Math.round(14 - Math.sqrt(Math.max(0, 196 - (14 - t) ** 2))) : 0;
    if (x < cx - 30 + r || x >= cx + 30 - r) continue;
    const e = Math.min(x - (cx - 30 + r), cx + 30 - r - 1 - x);
    b.set(x, y, e < 2 ? PAL.N3 : t < 3 ? PAL.N3 : (y - top) % 16 === 0 ? PAL.N1 : PAL.N2);
  }
  // its seat (a cushion seen from the front, a little from above), the armrests at its sides, the column under it
  for (let y = 132; y < 146; y++) { const w = 34 + Math.round((y - 132) * 0.4); for (let x = cx - w; x < cx + w; x++) b.set(x, y, y < 135 ? PAL.N4 : y > 142 ? PAL.N1 : PAL.N3); }
  for (const ax of [cx - 40, cx + 34]) { fill(b, ax, 112, 6, 4, PAL.N4); fill(b, ax + 2, 116, 2, 20, PAL.N3); }
  fill(b, cx - 3, 146, 6, 16, PAL.N2);
  // a candle on the table at the chair (crisp: it stands in the table's plane)
  fill(b, 132, 150, 3, 12, PAL.P1); fill(b, 131, 162, 5, 1, PAL.W4);
  // the table's edge across the frame's foot
  for (let y = 162; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, y === 162 ? PAL.D3 : (x * 3 + y) % 41 < 2 ? PAL.D0 : PAL.D1);
  GS_BG = b;
  return b;
};
export interface GSSt { f: number; gerg?: {mouth?: 'rest' | 'open' | 'smile'; lid?: 0 | 1 | 2; look?: -1 | 0 | 1}; staffer?: Partial<BustState>; typing?: boolean; flare?: number }
/** [M] the empty chair beyond at the left; GERG (Ep1's approved portrait, his laptop's cool light from below, faced
 *  screen-right to her), typing; the STAFFER nearer, at frame right, faced camera-left (toward him, or past him to the
 *  chair); the candle at the chair the only warm light */
export const gergStaffer = (b: Buf, st: GSSt) => {
  b.c.set(gsBg().c.subarray(0, W * RH), 0);
  candleLight(b, [{x: 133, y: 144, r: 230 + (st.flare ?? 0) * 20}, {x: 460, y: 150, r: 150}], {amb: 0.26});
  const g = gergPortrait({mouth: st.gerg?.mouth ?? 'rest', lid: st.gerg?.lid ?? 1, look: st.gerg?.look ?? 1});
  const typ = st.typing === false ? 0 : gergTypeAt(Math.floor(st.f / 2));
  putBustCut(b, g, 150, 66 + (typ === 2 ? 1 : 0), RH, true);
  // his laptop's lid in front of him (its back to us, its top edge cyan), cutting his chest
  poly([158, RH + 2, 168, 172, 250, 168, 254, RH + 2], b.ink(PAL.N1)); line(168, 172, 250, 168, b.ink(PAL.C5)); line(168, 173, 250, 169, b.ink(PAL.C2));
  const s = stafferBust({mouth: 'rest', expr: 'neutral', ...(st.staffer ?? {})});
  putBustCut(b, s, 320, 46, RH, false);
  // the candle's warm rim on the faces' sides toward it (Gerg's back, her far cheek stays dark)
  const snap = new Int32Array(b.c);
  const sk = (x: number, y: number) => isSkin(snap[y * W + x]);
  for (let y = 46; y < RH; y++) for (let x = 151; x < 262; x++) if (sk(x, y) && !sk(x - 1, y)) b.set(x, y, PAL.W7);
  for (let j = 0; j < 5; j++) b.set(133, 149 - j, j < 2 ? PAL.W9 : PAL.W7);
};
/** [MCU] GERG typing, his correction: his approved portrait faced screen-right (to the staffer off frame), the laptop's
 *  cool light from below, the candle's warm rim on his back edge; the empty chair soft far left */
export const gergMCU = (b: Buf, st: {f: number; mouth?: 'rest' | 'open' | 'smile'; lid?: 0 | 1 | 2; look?: -1 | 0 | 1}) => {
  b.c.set(gsBg().c.subarray(0, W * RH), 0);
  candleLight(b, [{x: 133, y: 144, r: 230}], {amb: 0.24});
  dimRoom(b, 1);
  const typ = gergTypeAt(Math.floor(st.f / 2));
  putBustCut(b, gergPortrait({mouth: st.mouth ?? 'rest', lid: st.lid ?? 1, look: st.look ?? 1}), 176, 40 + (typ === 2 ? 1 : 0), RH, true);
  poly([182, RH + 2, 194, 158, 286, 152, 292, RH + 2], b.ink(PAL.N1)); line(194, 158, 286, 152, b.ink(PAL.C5)); line(194, 159, 286, 153, b.ink(PAL.C2));
  const snap = new Int32Array(b.c);
  const sk = (x: number, y: number) => isSkin(snap[y * W + x]);
  for (let y = 40; y < RH; y++) for (let x = 177; x < 288; x++) if (sk(x, y) && !sk(x - 1, y)) b.set(x, y, PAL.W7);
  // two fingertips at the lid's edge, ticking on his typing
  for (const [i, tx] of [[1, 214], [2, 232]] as Array<[number, number]>) { const dn = typ === i ? 1 : 0; fill(b, tx, 166 + dn, 5, 4, PAL.K2); fill(b, tx + 1, 166 + dn, 3, 1, PAL.K4); }
};
/** [MCU] the staffer at the board's corner, leaning to Gerg (off frame right) and whispering behind her cupped hand
 *  (her lines are O.S.: her mouth never shows) */
export const stafferMCU = (b: Buf, st: {f: number; look?: -1 | 0 | 1; expr?: 'worry' | 'neutral' | 'squint'}) => {
  b.c.set(gsBg().c.subarray(0, W * RH), 0);
  candleLight(b, [{x: 133, y: 144, r: 220}], {amb: 0.2});
  dimRoom(b, 1);
  const s2 = stafferBust({mouth: 'rest', expr: st.expr ?? 'worry', look: st.look ?? 0});
  const X = 176, Y = 26;
  putBustCut(b, s2, X, Y, RH, true);
  // her near hand cupped at the side of her mouth (the fingers together, upright, the palm toward Gerg off frame
  // right; the back of the hand to us), the forearm down out of frame
  const m = STAFFER_MOUTH;
  const mx = X + (112 - 1 - m[0]) + 9, my = Y + m[1] - 2;
  sleeve(b, [mx + 6, my + 22], [mx + 14, RH + 20], 8, 11, [PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3]);
  const HS = [PAL.S2, PAL.S3, PAL.S4, PAL.S5];
  for (let j = -11; j <= 24; j++) for (let i = -5; i <= 5; i++) {
    const w = j < -8 ? 3 : j > 14 ? 4 : 5;
    if (Math.abs(i) > w) continue;
    const knuckle = j === 4, finger = (i + 5) % 3 === 0 && j < 4 && j > -9;
    b.set(mx + i, my + j, Math.abs(i) === w ? HS[0] : knuckle ? HS[1] : finger ? HS[1] : i > 2 ? HS[3] : HS[2]);
  }
};
const STAFFER_MOUTH: [number, number] = (() => { const a = bustAnchors(STAFFER_SPEC); return [Math.round(a.mouth[0]), Math.round(a.mouth[1])]; })();

// ================================================================== NOLE and GHOST-NOLE, face to face (2S)
/** a portrait in the ghost treatment: pale cyan, a 50 % screen, the faint second image (2.G) */
const ghostOver = (b: Buf, img: Img, x: number, y: number, flip: boolean) => {
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const v = img.c[j * img.w + (flip ? img.w - 1 - i : i)]; if (v < 0) continue;
    const X = x + i, Y = y + j; if (Y >= RH) continue;
    const L = lightness(v), c = L > 0.55 ? PAL.C9 : L > 0.38 ? PAL.C8 : L > 0.24 ? PAL.C7 : L > 0.12 ? PAL.C6 : PAL.C4;
    if (((X + Y) & 1) === 0) b.set(X, Y, c); else b.set(X, Y, stepColor(b.get(X, Y), 1));
    if (((X + Y) & 3) === 1 && X + 2 < W && Y - 2 >= 0) b.set(X + 2, Y - 2, PAL.C4);
  }
};
export interface Noles2S { f: number; nole: {mouth?: 0 | 1 | 2 | 3 | 4; jab?: 0 | 1 | 2; dip?: number; brow?: 0 | 1}; ghost: {mouth?: 0 | 1 | 2 | 3 | 4; dip?: number}; header?: boolean }
/** [2S] NOLE (right, his portrait facing camera-left) and GHOST-NOLE (left, the same portrait flipped, in the ghost
 *  treatment, the 2018 hoodie's hood behind its neck), face to face: same jaw, same phone; the ghost's dated header
 *  held up between them */
export const noles2S = (b: Buf, st: Noles2S) => {
  const bg = NOLE_BG.get('off') ?? (() => { const x = noleBg(false); NOLE_BG.set('off', x); return x; })();
  b.c.set(bg.c.subarray(0, W * RH), 0);
  const n = nolePortraitImg({mouth: st.nole.mouth ?? 0, jab: st.nole.jab ?? 0, blink: 0, brow: st.nole.brow ?? 0, dip: st.nole.dip ?? 0});
  const g = nolePortraitImg({mouth: st.ghost.mouth ?? 0, jab: 0, blink: 0, brow: 0, dip: st.ghost.dip ?? 0});
  putBustCut(b, n as Img, 262, 50, RH, false);
  for (let y = 0; y < RH; y++) for (let x = 262; x < 374; x++) { const c = b.get(x, y); const w2 = warm(c); if (w2 !== c) b.set(x, y, w2); }
  // the hood behind the ghost's neck (the 2018 hoodie)
  for (let j = 0; j < 22; j++) for (let i = 0; i < 40; i++) if (Math.hypot((i - 20) / 20, (j - 11) / 11) < 1) { const X = 132 + i, Y = 136 + j; if (((X + Y) & 1) === 0) b.set(X, Y, PAL.C6); }
  ghostOver(b, g as Img, 106, 50, true);
  if (st.header !== false) {
    // its dated header held up between them (the ghost's header: the record's date)
    const s = 'DEC 2018', w = pw(s) + 10;
    for (let j = 0; j < 13; j++) for (let i = 0; i < w; i++) { const X = 226 - (w >> 1) + i, Y = 18 + j; if (((X + Y) & 1) === 0 || j === 0 || j === 12) b.set(X, Y, j === 0 || j === 12 ? PAL.C7 : PAL.C4); }
    pt(b, s, 226 - (w >> 1) + 5, 21, PAL.C9);
  }
  noleFore(b, null, st.f);
};

// ================================================================== Mas's hand on his glass (ECU)
/** the crystal tumbler of water at the head of the table, his hand round it; behind, the candle nearest Nole soft (its
 *  flame a bokeh disc); the slap's flame jump; the lift; the snuff and its smoke curling across the glass */
export interface GlassSt { f: number; lift?: number; flame?: 0 | 1 | 2; snuffed?: number | null; ripple?: boolean }
let GLASS_BG: Buf | null = null;
const glassBg = () => {
  if (GLASS_BG) return GLASS_BG;
  const b = new Buf(W, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, y < 136 ? (bayer(x, y) < 0.2 ? PAL.N1 : PAL.N0) : (x * 3 + y * 7) % 61 < 2 ? PAL.D1 : y < 140 ? PAL.D3 : PAL.D2);
  fill(b, 0, 136, W, 2, PAL.D4);
  GLASS_BG = b;
  return b;
};
/** a cut-crystal tumbler: elliptical rim and base, slightly tapered walls, vertical facets, the water (its surface an
 *  ellipse), what is behind it seen through it a rung brighter and shifted (refraction), the candle's glint */
/** what the water shows of the room behind it: the same light, but clear (no colour of its own): any colour walked to
 *  the cool neutral greys at its own lightness, a rung up (water and glass gather light) */
const throughWater = (c: number) => {
  const L = lightness(c);
  const G = [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2];
  return G[Math.max(0, Math.min(G.length - 1, Math.round(L * 10) + 1))];
};
export const tumbler = (b: Buf, cx: number, top: number, w: number, h: number, o: {water?: number; ripple?: boolean; glint?: number; smoke?: (x: number, y: number) => boolean; lit?: -1 | 0 | 1; flame?: boolean} = {}) => {
  const rx = w / 2, ry = Math.max(2, Math.round(w * 0.16)), bot = top + h;
  const src = new Int32Array(b.c);
  const wl = top + Math.round(h * (o.water ?? 0.32));
  const lit = o.lit ?? 1;
  const at = (x: number, y: number) => (x >= 0 && x < W && y >= 0 && y < RH ? src[y * W + x] : PAL.N0);
  for (let y = top - ry; y <= bot + ry; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
    if (y < 0 || y >= RH || x < 0 || x >= W) continue;
    const t = clamp((y - top) / h, 0, 1), half = rx - t * 2.5;
    const u = (x - cx) / half;
    const body = y >= top && y <= bot && Math.abs(u) <= 1;
    const rim = y < top && Math.hypot((x - cx) / rx, (y - top) / ry) <= 1;
    const base = y > bot && Math.hypot((x - cx) / half, (y - bot) / ry) <= 1;
    if (!body && !rim && !base) continue;
    let c = stepColor(at(x, y), 1);
    // the rim: clear glass, its edge catching the candle on the lit side (the only warm thing on the glass)
    if (rim) { const d = Math.hypot((x - cx) / rx, (y - top) / ry); c = d > 0.78 ? ((x - cx) * lit > rx * 0.3 ? PAL.W7 : y > top - 1 ? PAL.P1 : PAL.G5) : stepColor(at(x, y), 1); b.set(x, y, c); continue; }
    if (base || y > bot - Math.round(h * 0.12)) { c = throughWater(at(x, y)); if (Math.abs(u) > 0.85 || y === bot - Math.round(h * 0.12)) c = PAL.G5; b.set(x, y, c); continue; }
    // above the water the glass is empty and clear: the room behind it exactly as it is (no fill of its own); the
    // water: clear (the room behind it in cool greys, a rung up), its surface an ellipse of pale cyan
    c = y >= wl ? throughWater(at(x, y)) : at(x, y);
    if (Math.abs(y - wl - Math.round(Math.sqrt(Math.max(0, 1 - u * u)) * ry * 0.6)) < 1) c = o.ripple && ((x >> 2) % 2) ? PAL.C9 : PAL.C8;
    // the walls: the edge toward the candle a warm rim, the other edge dark glass; the cut facets catch the light in
    // pale dashes (cool, never amber)
    if (Math.abs(u) > 0.9) c = u * lit > 0 ? (bayer(x, y) < 0.7 ? PAL.W7 : PAL.W5) : PAL.G4;
    else if (Math.abs(((x - cx) % 8)) === 4 && y % 3 !== 0) c = y >= wl ? stepColor(c, 1) : stepColor(c, 1);
    if (o.smoke && o.smoke(x, y) && y < wl) c = PAL.G5;
    b.set(x, y, c);
  }
  // the candle beyond, refracted through the water: its flame small and upside down on the side toward it
  if (o.flame && lit) {
    const fx = Math.round(cx + lit * rx * 0.38), fy = Math.round(wl + Math.max(3, h * 0.05));
    const s = Math.max(1, Math.round(w / 32));
    for (let j = 0; j < 5 * s; j++) { const wd = j < 2 * s ? 0 : j < 4 * s ? s : Math.max(0, s - 1); for (let i = -wd; i <= wd; i++) b.set(fx + i, fy + j, j < 2 * s ? PAL.W6 : j < 4 * s ? (i === 0 ? PAL.W9 : PAL.W8) : PAL.W7); }
    // and the bright streak the cylinder makes of it, a pale line down the water
    for (let y = wl + 3; y < bot - h * 0.12 - 2; y++) if (bayer(fx, y) < 0.6 && Math.abs(y - fy) > 5 * s) b.set(fx, y, PAL.G6);
  }
  if (o.glint !== undefined) { const gx = Math.round(cx - rx * 0.55); for (let y = top + 6; y < top + Math.round(h * 0.6); y++) if (bayer(gx, y) < 0.8) b.set(gx, y, o.glint); }
};
export const glassECU = (b: Buf, st: GlassSt) => {
  b.c.set(glassBg().c.subarray(0, W * RH), 0);
  const fl = st.flame ?? 0, sn = st.snuffed;
  const lit = sn === null || sn === undefined || sn < 0;
  // the candle beyond, soft (its stub; its flame a bokeh disc, jumping on the slap)
  fill(b, 324, 104, 12, 32, PAL.P0); fill(b, 324, 104, 12, 2, PAL.P1);
  candleLight(b, lit ? [{x: 330, y: 92, r: 300 + fl * 50}] : [{x: 330, y: 96, r: 80}], {amb: 0.3});
  const lift = st.lift ?? 0;
  const cx = 196, top = 42 - lift, h = 92;
  const smokeAt = (X: number, Y: number) => !lit && sn! < 64 && Math.abs(Y - (98 - sn! * 0.9 + Math.sin((X + sn! * 2) / 11) * 7 - (330 - X) * 0.05)) < 2 + ((X >> 1) % 3 === 0 ? 1 : 0) && X > 110 && X < 334 && bayer(X, Y) < 0.75 - sn! / 90;
  tumbler(b, cx, top, 64, h, {water: 0.2, ripple: !!st.ripple, glint: lit ? PAL.P2 : PAL.G5, smoke: smokeAt, lit: 1, flame: lit});
  if (!lit) for (let X = 110; X < 336; X++) for (let Y = 0; Y < RH; Y++) if (smokeAt(X, Y) && (X < cx - 34 || X > cx + 34)) b.set(X, Y, PAL.G4);
  if (lift === 0) for (let y = top + h + 7; y < top + h + 13; y++) for (let x = cx - 40; x < cx + 22; x++) if (bayer(x, y) < 0.5 && y < RH) b.set(x, y, PAL.D1);
  // his hand round its lower half: the fingers across the front, the thumb on the near side; the wrist straight on
  // the forearm, which rises gently from his elbow on the table (out of frame, left)
  const h2 = placeHand(POSES.grip([0.95, -0.2, 0.22], [0.1, -0.15, 0.98], 'R', 0.72), {s: 4.6, at: [cx + 16, top + 62], anchor: 'middle', light: 'lobby', key: [0.6, -0.5, 0.6], cuffRamp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G4, PAL.G5]});
  // the forearm: on the wrist's own line (a few degrees lower, never a kink), tapering from the elbow to the cuff
  const ax = h2.cuffEnd[0] - h2.wrist[0], ay = h2.cuffEnd[1] - h2.wrist[1], aL = Math.hypot(ax, ay) || 1;
  const rot = -0.12, ux = (ax * Math.cos(rot) - ay * Math.sin(rot)) / aL, uy = (ax * Math.sin(rot) + ay * Math.cos(rot)) / aL;
  const fore: [number, number] = [h2.cuffEnd[0] + ux * 260, h2.cuffEnd[1] + uy * 260];
  const SLV = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3];
  sleeve(b, h2.cuffEnd, fore, 14, 22, SLV, [-0.55, -0.83], {fold: false});
  // the hoodie's ribbed cuff at the wrist: a band a rung lighter, its ribs
  const c0: [number, number] = [h2.cuffEnd[0] - ux * 2, h2.cuffEnd[1] - uy * 2], c1: [number, number] = [h2.cuffEnd[0] + ux * 9, h2.cuffEnd[1] + uy * 9];
  sleeve(b, c0, c1, 13.5, 14.5, [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4], [-0.55, -0.83], {fold: false});
  for (let s = 0; s < 11; s++) for (let q = -13; q <= 13; q++) { const X = Math.round(c0[0] + ux * s - uy * q), Y = Math.round(c0[1] + uy * s + ux * q); if (X >= 0 && Y >= 0 && Y < RH && (q & 1) === 0) b.set(X, Y, stepColor(b.get(X, Y), -1)); }
  drawHand(b, h2.hand, h2.x, h2.y);
  if (lit) bokeh(b, 330, 92 - fl * 8, 10 + fl * 4, PAL.W8, PAL.W5);
};

// ================================================================== 4.34 the reverse: over Nole's shoulder onto Mas
/** MAS candlelit in the left third (his approved portrait, faced screen-right toward Nole, warm), the dark window
 *  behind him; Nole's shoulder and the back of his head in the right foreground, his arm up, the candle in his hand
 *  held to Mas's face; `sip`: Mas's glass up at his mouth */
export const masReverse = (b: Buf, st: {f: number; candle?: [number, number]; sip?: number; look?: -1 | 0 | 1}) => {
  b.c.set(masLowBg().c.subarray(0, W * RH), 0);
  const [cx, cy] = st.candle ?? [184, 104];
  candleLight(b, [{x: cx, y: cy - 8, r: 230}], {amb: 0.2});
  const img = masPortrait({mouth: 'rest', lid: 0, look: st.look ?? 1, brow: 0, light: 'warm', head: '34'});
  const X = 78, Y = 40;
  putBustCut(b, img, X, Y, RH, true);
  // the candle held at his cheek: its light falls off across his face from the near side (a step up near it, the rim
  // on the near edge two; the far side a step down), so the face reads lit BY the candle, not evenly
  {
    const snap = new Int32Array(b.c);
    const sk = (x: number, y: number) => isSkin(snap[y * W + x]);
    for (let y = Y; y < Math.min(RH, Y + 110); y++) for (let x = X + 10; x < X + 112; x++) {
      const c = snap[y * W + x]; if (!isSkin(c)) continue;
      const d = Math.hypot(x - cx, (y - (cy - 4)) * 1.2);
      b.set(x, y, !sk(x + 1, y) && d < 80 ? stepColor(c, 2) : d < 62 ? stepColor(c, 1) : d > 92 ? stepColor(c, -1) : c);
    }
  }
  // the sip: his near hand brings the glass up to his mouth and back (0 down out of frame .. 3 at his lips)
  const sp = st.sip ?? 0;
  if (sp > 0) {
    const gy = [0, 170, 140, 112][sp], gx = X + 68;
    tumbler(b, gx + 11, gy, 22, 30, {water: 0.3});
    const h = placeHand(POSES.grip([-0.95, 0.1, 0.2], [0, -0.2, 0.98], 'L', 0.7), {s: 1.7, at: [gx + 10, gy + 20], anchor: 'middle', light: 'lobby', key: [0.4, -0.5, 0.7], cuffRamp: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G4, PAL.G5]});
    sleeve(b, h.cuffEnd, [h.cuffEnd[0] - 10, RH + 20], 6, 8, [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G3]);
    drawHand(b, h.hand, h.x, h.y);
  }
  // Nole's near arm from his shoulder in the right foreground, bent at the elbow, the candle in his hand held up at
  // Mas's cheek like evidence
  const NR = [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N2];
  const elb: [number, number] = [Math.round((cx + 430) / 2) + 6, Math.max(cy + 62, 170)];
  sleeve(b, [430, RH + 6], elb, 18, 16, NR);
  sleeve(b, elb, [cx + 14, cy + 36], 15, 12, NR);
  const hh = placeHand(POSES.grip([-0.3, -0.95, 0.1], [0.9, -0.1, 0.3], 'R', 0.75), {s: 2.4, at: [cx + 4, cy + 18], anchor: 'middle', light: 'lobby', key: [-0.6, -0.5, 0.6], cuffRamp: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N2, PAL.N3, PAL.N3]});
  fill(b, cx - 3, cy, 7, 26, PAL.P1); fill(b, cx - 3, cy, 7, 1, PAL.P2); fill(b, cx + 2, cy, 2, 26, PAL.P0);
  drawHand(b, hh.hand, hh.x, hh.y);
  noleShoulder(b, 450, 92);
  for (let j = 0; j < 5; j++) { b.set(cx, cy - 1 - j, j < 2 ? PAL.W9 : PAL.W7); if (j < 3) b.set(cx + 1, cy - 1 - j, PAL.W7); }
};

// ================================================================== 4.36 the last candle
/** [MCU] Mas leans in to the candle in front of him (lit from below by it alone) and blows it out; `lean` 0..2, `blow`
 *  frames since the breath (-1 before), then the dark */
export const masBlow = (b: Buf, st: {f: number; lean: 0 | 1 | 2; blow: number}) => {
  fill(b, 0, 0, W, RH, PAL.N0);
  const img = masPortrait({mouth: st.blow >= 0 && st.blow < 6 ? 'O' : 'rest', lid: 1, look: 1, brow: 0, light: 'warm', head: '34'});
  // the candle stands right under his chin; he leans in (two held steps) until his pursed lips are a few pixels from
  // its flame, so the blow is his act, not the candle dying by itself
  const X = 126 + st.lean * 10, Y = 52 + st.lean * 8;
  putBustCut(b, img, X, Y, RH, true);
  const cx = 222, cy = 150;
  fill(b, cx - 3, cy, 7, RH - cy, PAL.P1); fill(b, cx - 3, cy, 7, 1, PAL.P2); fill(b, cx + 2, cy, 2, RH - cy, PAL.P0);
  const lit = st.blow < 2;
  candleLight(b, lit ? [{x: cx, y: cy - 10, r: 200}] : [], {amb: 0.04});
  if (lit) { const bend = st.blow >= 0 ? 3 : 0; for (let j = 0; j < 7; j++) { b.set(cx + Math.round((j * bend) / 6), cy - 1 - j, j < 2 ? PAL.W9 : PAL.W7); if (j < 4) b.set(cx + 1 + Math.round((j * bend) / 6), cy - 1 - j, PAL.W7); } }
  if (!lit && st.blow < 40) { b.set(cx, cy - 1, PAL.W4); smokeWisp(b, cx, cy - 2, st.blow - 2, 0.6); }
};
