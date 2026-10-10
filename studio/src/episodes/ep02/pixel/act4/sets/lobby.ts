// MR. MAS — Ep2 v1 · act4 · THE NOPEAI LOBBY in Act Four: sc 19's watch party (JUN 10, the keynote on the wall screen)
// and sc 20's next morning (JUN 11). The shots pass, 2026-10-09. The room is the art pass's master (art/sets/lobby2
// drawLobby2: the signs, the curling flyers with his upside-down one, the complaint a side table with its cups, the
// corner TV, the tusk behind the back row) and the cold open's continuity (the beanbag rows, Gerg on his own beanbag
// with his laptop: coldopen/sets.ts gergSitting, COPIED); this file adds what the shots need:
//   party(b, f, st)        [W] 19.01-19.06: the watch party: the keynote (or the stream's crowd) on the wall screen,
//                          signs 202 / 102, the staff on their beanbags (watching; cheering; half of them up on their
//                          beanbags), GERG on his (typing; his phone out), HARAS walking in from the doors along the hand
//                          truck's path with her calculator tape unspooling, then on the beanbag beside Gerg; a staffer
//                          standing to point at the wall screen ("Is that Mas?", room mouth); the desk confetti cannon
//   tvClose(b, f)          [SCR] 19.02: the corner TV close (its bezel, the lobby soft beyond): the presser's lectern still
//                          stuck at FLOOR, a tally on it now: 0 BILLS (art/props/ui presserFull, stuck), 1:1
//   harasGerg(b, f, st)    [2S] 19.04-19.05: GERG (his speaking portrait, turned to her, his laptop on his knees) and
//                          HARAS (art/cast/haras, her tape) on the beanbags, lip-synced; behind them the lobby soft and the
//                          wall screen low (the keynote; at the announcement `…AND LATER THIS YEAR: CHATGTP.`); the staff
//                          rising to cheer behind them, confetti in the air
//   onStream(b, f, st)     [SCR] 19.05 / 19.06: the wall screen full frame in our stream's UI: the announcement, or the
//                          stream cutting away to its outdoor audience with Mas small at its edge, head down, typing
//   gergCall(b, f, st)     [MCU] 19.06 / 19.09 / 19.10: GERG with his phone (out; at his ear), the lobby behind him
//                          cheering, half of it standing on the beanbags; lip-synced
//   morning(b, f, st)      [W] 20.05 / 20.07 / 20.09: JUN 11, morning: signs 203 / 103, the confetti swept into a pile,
//                          two staffers taking the party and the flyers down; MAS at the back with his glass peeling his
//                          own upside-down flyer off the pillar, folding it into his jacket; HARAS passing, her tape
//                          trailing, UPSIDE circled; the complaint on its rope, rising out of frame; the clean rectangle;
//                          the (FOR NOW) note fluttering down onto it
//   docket(b, f, st)       [ECU] 20.08: the complaint's cover, the coffee cups on it, its docket tab HEARING · JUN 12 ·
//                          MOTION TO DISMISS (art/sets/lobby2-art docketECU's pieces)
// No image of Alyi anywhere; the flyers' photos are doorways with nobody in them (the art's).
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import {gergTypeAt} from '../../../../../shared/pixel/cast/gerg';
import {gergSpeakPortrait} from '../../../../../shared/pixel/cast/gerg-speak';
import {drawGergPose, GERG_POSE_FOOT} from '../../../../../shared/pixel/cast/gerg-poses';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {SKIN, HAIR, roomWalkAt} from '../../../../../shared/pixel/cast/civic-kit';
import {drawLobby2, drawFlyer, drawComplaint, drawConfetti, drawTusk, LOBBY2} from '../../art/sets/lobby2';
import {presserFull} from '../../art/props/ui';
import {keynotePainter, streamCrowd} from '../../art/sets/elppa';
import {seatedStaff, beanbag, makeRoom} from '../../art/cast/civic2';
import type {SeatPose, RoomFigSpec} from '../../art/cast/civic2';
import {harasBust, drawHarasRoom, drawCalcTape} from '../../art/cast/haras';
import type {HarasBust} from '../../art/cast/haras';
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Legs, Mas2Arm} from '../../art/cast/mas2';
import {placeHand, drawHand, sleeve, holdPhone, POSES, skinDown} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp, TR} from '../../art/kit';
import {RH, W, glow, mirror, putBustSoft, compose, dimRoom, footClean} from './common';
import {lawn, MAS_EDGE} from './campus';

// ================================================================== the staff, Gerg, the standing cheer
/** standing staffers for the cheer (three looks; nobody named, nobody real), room scale */
const STAND: RoomFigSpec[] = [
  {kind: 'jacket', legMat: 'jeans', ramps: {skin: SKIN.light, hair: HAIR.brown, suit: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5], shirt: [PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6], jeans: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5]}, backRamp: {skin: PAL.S3, suit: PAL.F4}} as RoomFigSpec,
  {kind: 'blazer', legMat: 'trou', ramps: {skin: SKIN.deep, hair: HAIR.dark, suit: [PAL.N0, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7], shirt: [PAL.N1, PAL.P0, PAL.P1, PAL.P2, PAL.P2, PAL.W9], trou: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5]}, backRamp: {skin: PAL.S2, suit: PAL.W5}} as RoomFigSpec,
  {kind: 'jacket', legMat: 'jeans', ramps: {skin: SKIN.medium, hair: HAIR.dark, suit: [PAL.N0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.L3], shirt: [PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6], jeans: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5]}, backRamp: {skin: PAL.S3, suit: PAL.L2}} as RoomFigSpec,
];
const STANDERS = STAND.map((s) => makeRoom(s));
/** GERG on his beanbag (gerg-poses sit), his laptop's light the show's monitor cyan (coldopen/sets.ts gergSitting,
 *  copied); `phone`: his laptop set aside, his phone up in his hand */
const gergSitting = (b: Buf, x: number, y: number, f: number, phone = false) => {
  const t = new Buf(W, RH, TR);
  drawGergPose(t, x, y, {body: 'sit', type: phone ? 0 : gergTypeAt(Math.floor(f / 2)), look: phone ? 'up' : 'screen'});
  const oy = y - GERG_POSE_FOOT[1], ox = x - GERG_POSE_FOOT[0];
  for (let yy = oy; yy < oy + 80; yy++) for (let xx = ox; xx < ox + 50; xx++) {
    if (t.get(xx, yy) !== PAL.L3) continue;
    if (yy - oy < 40) { const s = t.get(xx, yy - 1); t.set(xx, yy, s === PAL.L3 || s === TR ? PAL.S4 : s); }
    else t.set(xx, yy, PAL.C6);
  }
  compose(b, t);
  if (phone) { fill(b, ox + 24, oy + 30, 3, 5, PAL.N1); b.set(ox + 25, oy + 31, PAL.C5); }
};
export type Crowd = 'watch' | 'cheer' | 'laugh';
export const GERG_AT = {x: 196, y: 190};
/** the beanbag where Haras sits (row 1's first, beside Gerg) */
export const HARAS_SEAT = {x: 244, y: 190};
/** the staff rows (the art's beanbags), their poses by the moment; `up`: every other one standing on their beanbag,
 *  arms up (the cheer); Haras's seat left for her */
const staffRows = (b: Buf, f: number, crowd: Crowd, up: boolean, harasSeat: boolean) => {
  const rows: Array<[number, number]> = [[176, 0], [190, 1]];
  for (const [ry, r] of rows) for (let k = 0; k < 5; k++) {
    const x = 226 + k * 40 + r * 18, seed = r * 11 + k * 3 + 1;
    if (harasSeat && r === 1 && k === 0) continue;
    beanbag(b, x, ry - 4, seed);
    if (up && (k + r) % 2 === 0) {
      const S = STANDERS[(k + r * 2) % 3], bob = Math.floor((f + seed * 3) / 8) % 2;
      S.draw(b, x + 15, ry - 6 - bob, {arm: 'up', legs: 'stand', head: {hair: (['short', 'bun', 'curly'] as const)[(k + r) % 3], mouth: 'open', woman: (k + r) % 3 === 1}});
      continue;
    }
    const pose: SeatPose = crowd === 'watch' ? ((f + seed * 13) % 97 < 50 ? 'watch' : 'type') : crowd === 'cheer' ? 'cheer' : (seed % 3 === 0 ? 'turn' : 'watch');
    const bob = crowd !== 'watch' ? Math.floor((f + seed * 5) / 6) % 2 : 0;
    blitImg(b, seatedStaff({seed, pose}), x + 2, ry - 28 - bob);
  }
};
/** a staffer standing at the front of the rows to point at the wall screen (room scale, a room mouth) */
const POINTER = makeRoom(STAND[2]);

// ================================================================== the watch party, wide
export interface PartySt {
  /** the wall screen: the keynote's stage, its announcement, the stream's crowd cutaway (with his post in its chat) */
  screen?: 'stage' | 'later' | 'stream';
  crowd?: Crowd;
  /** half the lobby up on its beanbags */
  up?: boolean;
  /** Haras: walking in (her foot x, the tape's trail from the doors) or seated beside Gerg */
  haras?: {walk: number} | 'seated' | null;
  /** Gerg: typing, or his phone out */
  gerg?: 'type' | 'phone';
  /** the staffer pointing at the screen, and his room mouth */
  pointer?: 'open' | 'rest' | null;
  /** the desk confetti cannon's burst (frames since) */
  confetti?: number;
  door?: 0 | 1 | 2;
}
const screenPainter = (st: PartySt, f: number) => (b: Buf, r: {x: number; y: number; w: number; h: number}) => {
  if (st.screen === 'stream') { streamCrowd(b, r, f); return; }
  keynotePainter(b, r, {slide: st.screen === 'later' ? 'later' : 'stage', f});
};
export const party = (b: Buf, f: number, st: PartySt = {}) => {
  const seated = st.haras === 'seated';
  drawLobby2(b, {f, time: 'day', sign1: '202', sign2: '102', flyers: 'curl', upside: true, complaint: 'table', cups: true, tv: 'stuck', beanbags: false, door: st.door ?? 0, screen: screenPainter(st, f)}, {
    front: (bb) => {
      drawTusk(bb, 250, 172);
      staffRows(bb, f, st.crowd ?? 'watch', !!st.up, true);
      beanbag(bb, GERG_AT.x - 4, GERG_AT.y - 22, 4);
      gergSitting(bb, GERG_AT.x + 8, GERG_AT.y + 6, f, st.gerg === 'phone');
      // (the shots pass: the cross-legged drawing's foot is its standing foot, ~16 px under its hips, so at the seat's
      // y she sat on the air over the beanbag; dropped 14 px, her hips sink into its top)
      if (seated) { beanbag(bb, HARAS_SEAT.x, HARAS_SEAT.y - 4, 9); drawHarasRoom(bb, HARAS_SEAT.x + 14, HARAS_SEAT.y + 12, {state: 'seated'}); drawCalcTape(bb, [[HARAS_SEAT.x + 22, HARAS_SEAT.y - 4], [HARAS_SEAT.x + 34, HARAS_SEAT.y + 6], [HARAS_SEAT.x + 60, HARAS_SEAT.y + 8], [LOBBY2.DOORS.x0, 194]]); }
      if (st.pointer) POINTER.draw(bb, 392, 192, {arm: 'point', legs: 'stand', head: {hair: 'short', mouth: st.pointer === 'open' ? 'open' : 'rest'}});
      if (st.confetti !== undefined && st.confetti >= 0 && st.confetti < 40) drawConfetti(bb, 320, 120, 'burst', st.confetti);
    },
  });
  // Haras walking in along the hand truck's path from the doors, her tape unspooling behind her to the door
  if (st.haras && typeof st.haras === 'object') {
    const x = st.haras.walk;
    drawHarasRoom(b, x, 194, {state: 'walk', legs: roomWalkAt(f)}, {flip: true});
    drawCalcTape(b, [[x + 6, 166], [x + 14, 186], [x + 30, 194], [LOBBY2.DOORS.x0 + 2, 194]]);
  }
};

// ================================================================== 19.02: the corner TV close
/** the lobby soft behind a close shot (the master pushed in 2x on its middle and two rungs down), cached */
let SOFT: Buf | null = null;
const lobbySoft = () => {
  if (SOFT) return SOFT;
  const t = new Buf(W, 270, PAL.N0);
  drawLobby2(t, {f: 0, time: 'day', sign1: '202', sign2: '102', flyers: 'curl', upside: true, complaint: 'table', cups: true, tv: 'stuck', beanbags: false, screen: null});
  const b = new Buf(W, RH, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(t.get(clamp(Math.round(120 + x / 2), 0, W - 1), clamp(Math.round(10 + y / 2), 0, RH - 1)), -2));
  SOFT = b;
  return b;
};
export const tvClose = (b: Buf, f: number) => {
  b.c.set(lobbySoft().c.subarray(0, W * RH));
  const full = new Buf(W, 270, PAL.N0);
  presserFull(full, f, {turn: 2, tenth: true, stuck: true});
  const X = 104, Y = 20, w = 272, h = 156, sx = 206, sy = 28;
  fill(b, X - 10, Y - 8, w + 20, h + 16, PAL.N0); fill(b, X - 10, Y - 8, w + 20, 1, PAL.G2); fill(b, X - 10, Y - 8, 1, h + 16, PAL.G1);
  fill(b, X + w / 2 - 6, Y + h + 8, 12, 30, PAL.G1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b.set(X + x, Y + y, full.get(sx + x, sy + y));
  // muted: the TV's own mute glyph in its corner (a speaker with a stroke)
  fill(b, X + w - 22, Y + 6, 4, 6, PAL.P2); poly([X + w - 18, Y + 6, X + w - 14, Y + 2, X + w - 14, Y + 15, X + w - 18, Y + 11], b.ink(PAL.P2)); line(X + w - 12, Y + 3, X + w - 6, Y + 14, b.ink(PAL.R3));
  for (let i = 0; i < 40; i++) for (let j = 0; j < 3; j++) { const x = X + 170 + i, y = Y + 4 + Math.round(i * 0.5) + j; if (bayer(x, y) < 0.3) b.set(x, y, stepColor(b.get(x, y), 1)); }
};

// ================================================================== 19.04-19.05: Haras and Gerg
/** the background of the two-shot: the lobby's stone wall soft, the wall screen low behind them (the keynote, or the
 *  announcement), the staff on their beanbags out of focus behind them; at the cheer, the staff rising, arms up */
const twoShotBack = (b: Buf, f: number, st: {slide: 'stage' | 'later'; cheer: number}) => {
  // the stone wall (courses and joints, a step lighter toward the screen), the floor dark stone with the red runner
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const course = ((y + 6) % 22) < 2, joint = ((x + (Math.floor((y + 6) / 22) % 2) * 17) % 34) < 2;
    let c: number;
    if (y < 132) { c = course || joint ? PAL.G1 : PAL.G2; if (bayer(x, y) < 0.18) c = PAL.G3; }
    else c = y > 150 && y < 160 ? ((x * 3 + y) % 23 < 2 ? PAL.R0 : PAL.R1) : (x * 7 + y * 3) % 41 < 2 ? PAL.G0 : PAL.G1;
    b.set(x, y, c);
  }
  // the wall screen behind them, low and big (a bezel; its picture a rung down unless the announcement is up)
  const S = {x: 200, y: 6, w: 210, h: 104};
  fill(b, S.x - 5, S.y - 5, S.w + 10, S.h + 10, PAL.N0);
  const t = new Buf(W, 270, PAL.N0);
  keynotePainter(t, S, {slide: st.slide, f});
  for (let y = S.y; y < S.y + S.h; y++) for (let x = S.x; x < S.x + S.w; x++) b.set(x, y, st.slide === 'later' ? t.get(x, y) : stepColor(t.get(x, y), -1));
  glow(b, S.x + S.w / 2, S.y + S.h / 2, 190, 110, 1, (x, y) => x >= S.x - 5 && x < S.x + S.w + 5 && y >= S.y - 5 && y < S.y + S.h + 5);
  // the staff behind them, out of focus (two rungs down): a row of heads and shoulders on their beanbags; at the cheer
  // they come up off them, every other one standing, both arms up from the shoulders in a V, the hands open
  for (let k = 0; k < 8; k++) {
    const x = 28 + k * 60 + ((k * 13) % 9), stand = st.cheer > 0 && k % 2 === 0;
    const rise = st.cheer > 0 ? Math.min(stand ? 30 : 8, Math.floor(st.cheer / 3) * 6) : 0, bob = st.cheer > 0 ? Math.floor((f + k * 4) / 7) % 2 : 0;
    const y = 128 - rise - bob;
    const sk = [PAL.S2, PAL.S4, PAL.D2, PAL.S3][k % 4], top = [PAL.F2, PAL.G3, PAL.W4, PAL.L1, PAL.U2][k % 5], hair = [PAL.B0, PAL.N0, PAL.B1, PAL.B2][k % 4];
    const T = stepColor(top, -2), Sk = stepColor(sk, -1), H = stepColor(hair, -1);
    for (let j = 0; j < 34; j++) { const hw = Math.min(17, 9 + j * 0.8); fill(b, Math.round(x - hw), y + 14 + j, Math.round(hw * 2), 1, T); }
    ellipse(x, y + 6, 6, 7, b.ink(Sk)); ellipse(x, y + 1, 6, 4, b.ink(H));
    if (st.cheer > 0) {
      for (const sd of [-1, 1]) {
        const sx = x + sd * 11, sy = y + 18, hx = x + sd * (19 + ((k + bob) % 2) * 2), hy = y - 12 + ((k + sd) % 3);
        const n = Math.max(Math.abs(hx - sx), Math.abs(hy - sy));
        for (let i = 0; i <= n; i++) { const px = Math.round(sx + ((hx - sx) * i) / n), py = Math.round(sy + ((hy - sy) * i) / n); fill(b, px - 1, py, 3, 1, T); }
        fill(b, hx - 2, hy - 4, 4, 4, Sk);
      }
    }
  }
};
const GS = new Map<string, ReturnType<typeof gergSpeakPortrait>>();
/** Gerg's speaking portrait mirrored (turned to camera-right, to Haras), his own skin */
const gergImg = (mouth: Viseme, look: -1 | 0 | 1) => { const k = mouth + look; let im = GS.get(k); if (!im) { im = mirror(footClean(gergSpeakPortrait({mouth, lid: 1, look}))); GS.set(k, im); } return im; };
export interface HarasGergSt { gerg?: Viseme; haras?: Viseme; harasExpr?: HarasBust['expr']; harasArm?: HarasBust['arm']; slide?: 'stage' | 'later'; cheer?: number; confetti?: number; type?: boolean }
export const harasGerg = (b: Buf, f: number, st: HarasGergSt = {}) => {
  twoShotBack(b, f, {slide: st.slide ?? 'stage', cheer: st.cheer ?? 0});
  // the beanbags under them (two soft lumps across the frame's foot)
  for (const [cx, col] of [[110, [PAL.U2, PAL.U3, PAL.U4]], [370, [PAL.F2, PAL.F3, PAL.F4]]] as Array<[number, number[]]>) for (let y = 160; y < RH; y++) for (let x = cx - 110; x < cx + 110; x++) { const d = Math.hypot((x - cx) / 110, (y - 205) / 44); if (d < 1) b.set(x, y, d > 0.9 ? col[0] : (x + y) % 9 === 0 ? col[2] : col[1]); }
  // GERG at the left, turned to her, his laptop on his knees, typing
  putBustSoft(b, gergImg(st.gerg ?? 'rest', 1), 56, 56, RH, false);
  // the laptop: its deck across his lap at the frame's foot, the lid's dark back to us, its edges lit by the screen
  // the laptop on his knees at the frame's foot: its lid's dark back angled toward him (its top edge and near edge lit
  // by the screen), the deck under it, two fingertips on the keys when he types
  const lx = 96, ly = 176;
  poly([lx - 22, RH + 2, lx + 50, RH + 2, lx + 46, ly + 14, lx - 18, ly + 14], b.ink(PAL.N2));
  poly([lx - 14, ly + 14, lx + 40, ly + 14, lx + 37, ly - 12, lx - 11, ly - 12], b.ink(PAL.N1));
  line(lx - 11, ly - 12, lx + 37, ly - 12, b.ink(PAL.C5)); line(lx - 14, ly + 14, lx - 11, ly - 12, b.ink(PAL.C4));
  fill(b, lx + 12, ly - 2, 3, 3, PAL.N2);
  if (st.type !== false) { const ty = gergTypeAt(Math.floor(f / 2)); for (const [tx, i] of [[lx - 4, 1], [lx + 26, 2]] as Array<[number, number]>) { const dn = ty === i ? 1 : 0; fill(b, tx, ly + 14 + dn, 5, 3, PAL.S4); fill(b, tx, ly + 14 + dn, 5, 1, PAL.S5); } }
  // HARAS at the right on the beanbag beside him, turned to him, her calculator tape
  putBustSoft(b, harasBust({mouth: st.haras ?? 'rest', expr: st.harasExpr ?? 'smile', arm: st.harasArm ?? 'tape'}), 300, 52, RH, false);
  if (st.confetti !== undefined && st.confetti >= 0) {
    const C = [PAL.W7, PAL.C6, PAL.R3, PAL.L3, PAL.P2, PAL.U4];
    for (let k = 0; k < 70; k++) { const x = Math.floor(hash(k, 1, 9) * W) + Math.round(Math.sin((st.confetti + k) / 7) * 3), y = Math.floor(hash(k, 2, 9) * 60) - 40 + Math.floor(st.confetti * (1.5 + hash(k, 3, 9))); if (y >= 0 && y < RH) { b.set(x, y, C[k % 6]); if (k % 3 === 0) b.set(x + 1, y, C[k % 6]); } }
  }
};

// ================================================================== the wall screen full frame (our stream's UI)
/** [SCR] the stream full frame in our stream's chrome (a LIVE tag, the progress bar): the keynote's announcement, or
 *  the cutaway to its outdoor audience with Mas small at its edge, head down over his phone, typing */
export const onStream = (b: Buf, f: number, st: {view: 'later' | 'crowd'}) => {
  const r = {x: 0, y: 0, w: W, h: RH};
  // (the crowd cutaway at 1:1: the campus itself, Mas small at the crowd's edge, head down, typing)
  if (st.view === 'crowd') lawn(b, f, {mas: {x: MAS_EDGE, arm: 'phone', bow: true}});
  else keynotePainter(b, r, {slide: 'later', f});
  fill(b, 8, 8, 30, 11, PAL.R2); tiny(b, 'LIVE', 12, 11, PAL.P2);
  fill(b, 0, RH - 9, W, 9, PAL.N1); fill(b, 6, RH - 5, Math.round(W * 0.62), 2, PAL.R2);
};

// ================================================================== Gerg on the phone
/** [MCU] Gerg on his beanbag in the cheering lobby (his speaking portrait, his own skin), his phone out at his chest
 *  (`phone` 'hand') or at his ear ('ear'); behind him the lobby half up on its beanbags; lip-synced */
export const gergCall = (b: Buf, f: number, st: {mouth?: Viseme; phone: 'hand' | 'ear'; cheer?: number}) => {
  twoShotBack(b, f, {slide: 'stage', cheer: st.cheer ?? 12});
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  // (mirrored: turned to camera-right, the crosscut's reverse of Mas on the lawn, who faces camera-left)
  const X = 230, Y = 30;
  const im = gergImg(st.mouth ?? 'rest', 0);
  putBustSoft(b, im, X, Y, RH, false);
  const CUFF = [PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.N3, PAL.C3], SLV = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.C3];
  if (st.phone === 'ear') {
    // the phone pressed to his ear (his mirrored portrait's visible ear at its left), his hand round its back, the
    // sleeve down out of frame
    const ex = X + 30, ey = Y + 54;
    fill(b, ex - 6, ey - 18, 10, 40, PAL.N0); fill(b, ex + 1, ey - 17, 2, 38, PAL.G3);
    const h = placeHand(POSES.grip([-0.1, -1, 0.1], [-0.95, 0, 0.3], 'R', 0.55), {s: 2.6, at: [ex - 5, ey + 6], anchor: 'middle', light: 'lobby', cuffRamp: CUFF});
    sleeve(b, h.cuffEnd, [ex - 34, RH + 40], 9, 13, SLV);
    drawHand(b, h.hand, h.x, h.y);
  } else {
    // his phone out in his hand at his chest, its screen lit, about to call
    const R = {x: X + 18, y: Y + 118, w: 30, h: 52};
    holdPhone(b, R, {side: 'L', grip: 'wrap', light: 'lobby', widthCm: 7, thumbAt: 0.4, sleeveTo: [X - 60, RH + 60], cuffRamp: CUFF, sleeveRamp: SLV,
      drawPhone: (bb) => { fill(bb, R.x, R.y, R.w, R.h, PAL.N0); fill(bb, R.x + 2, R.y + 3, R.w - 4, R.h - 6, PAL.N3); fill(bb, R.x + 5, R.y + 8, R.w - 10, 8, PAL.L2); tiny(bb, 'MAS', R.x + 7, R.y + 10, PAL.P2); }});
  }
};

// ================================================================== JUN 11, morning
export interface MorningSt {
  /** Mas: at the pillar peeling (`peel` 0..3: hands up, the corner, off, folding it into his jacket), then with his
   *  glass; null = not in frame */
  mas?: {peel: number; arm?: Mas2Arm} | null;
  /** Haras passing (her foot x), her tape trailing with UPSIDE circled */
  haras?: number | null;
  /** the complaint: on the floor with its cups, on the rope rising (rope px), gone (the clean rectangle) */
  complaint?: 'table' | {rope: number} | 'rect';
  /** the staffer at the complaint lifting the cups off (0 not yet, 1 hands on them, 2 lifted) */
  cups?: 0 | 1 | 2;
  /** the (FOR NOW) note: falling (0..3 its held steps) or landed (4) */
  note?: number | null;
}
const FLYER_MINE = {x: 160, y: 84};
export const morning = (b: Buf, f: number, st: MorningSt = {}) => {
  const m = st.mas;
  const peeled = !!m && m.peel >= 2;
  const comp = st.complaint ?? 'table';
  const roping = typeof comp === 'object';
  drawLobby2(b, {f, time: 'morning', sign1: '203', sign2: '103', flyers: peeled ? 'peeled' : 'curl', upside: true, complaint: roping ? 'rope' : comp, ropeY: roping ? comp.rope : 0, cups: st.cups === undefined || st.cups === 0, confetti: 'pile', tv: 'stuck', beanbags: false, screen: null, forNow: false}, {
    back: (bb) => {
      // the two staffers taking the party down at the far pillar (a streamer coming off it, a flyer in a hand)
      STANDERS[0].draw(bb, 314, 150, {arm: 'up', legs: 'stand', head: {hair: 'curly', mouth: 'rest'}});
      STANDERS[1].draw(bb, 344, 150, {arm: 'reach', legs: 'stand', head: {hair: 'bun', mouth: 'rest', woman: true}}, {flip: true});
      for (let i = 0; i < 18; i++) bb.set(318 + Math.round(Math.sin(i / 3) * 3), 60 + i * 2, [PAL.C6, PAL.R3, PAL.W7][i % 3]);
      // Mas at the back by his flyer's pillar
      if (m) {
        const arm: Mas2Arm = m.arm ?? (m.peel <= 1 ? 'tape' : m.peel === 2 ? 'reach' : 'pocket');
        drawMasStand2(bb, 150, 150, {arm, legs: 'stand', light: 'room'});
        // the flyer in his hands, peeling (its corner lifted) / off and folding (a folded square at his chest)
        if (m.peel === 1) { drawFlyer(bb, FLYER_MINE.x, FLYER_MINE.y, {curl: true, upside: true}); fill(bb, FLYER_MINE.x + 10, FLYER_MINE.y - 2, 4, 4, PAL.P1); }
        if (m.peel === 2) drawFlyer(bb, 160, 98, {upside: true, scale: 1, folded: false});
        if (m.peel === 3) { fill(bb, 154, 104, 7, 6, PAL.P2); fill(bb, 154, 104, 7, 1, PAL.W9); }
      }
    },
    floor: (bb) => {
      if (st.cups && st.cups > 0 && comp !== 'rect') {
        // the staffer at the complaint, lifting the cups off just in time
        const lift = st.cups === 2 ? 14 : 2;
        STANDERS[2].draw(bb, 236, 186, {arm: 'reach', legs: 'stand', head: {hair: 'short', mouth: 'open'}}, {flip: true});
        for (const cx of [214, 220]) { fill(bb, cx, 160 - lift, 5, 7, PAL.P2); fill(bb, cx, 162 - lift, 5, 2, PAL.C4); }
      }
      if (st.note !== null && st.note !== undefined) forNowNote(bb, st.note);
    },
  });
  if (st.haras !== null && st.haras !== undefined) {
    const x = st.haras;
    drawHarasRoom(b, x, 196, {state: 'walk', legs: roomWalkAt(f)}, {flip: true});
    // her tape trailing behind her, UPSIDE circled on it
    drawCalcTape(b, [[x + 6, 168], [x + 16, 186], [x + 40, 196], [x + 120, 197]], {upside: [x + 54, 186]});
  }
};
/** the (FOR NOW) sticky note: a yellow square fluttering down in held steps onto the clean rectangle; its words
 *  legible once it lands (tiny type, 4x) */
const forNowNote = (b: Buf, step: number) => {
  const tx = 168, ty = 166;
  const s = clamp(step, 0, 4);
  const pos: Array<[number, number, number]> = [[tx + 24, 40, 1], [tx - 4, 90, -1], [tx + 14, 136, 1], [tx + 2, 160, 0], [tx, ty, 0]];
  const [x, y, tilt] = pos[s];
  const w = tinyWidth('(FOR NOW)') + 6, h = 11;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j + Math.round((i - w / 2) * tilt * 0.12), j === 0 ? PAL.W8 : PAL.W7);
  if (s >= 3) tiny(b, '(FOR NOW)', x + 3, y + 3, PAL.N1);
};

// ================================================================== 20.08: the docket tab
export const docket = (b: Buf, f: number, st: {flick?: number} = {}) => {
  vramp(b, 0, 0, W, RH, [PAL.R0, PAL.R1, PAL.R0]);
  fill(b, 30, 70, 400, 110, PAL.P1); fill(b, 30, 60, 400, 12, PAL.P2); fill(b, 30, 60, 400, 1, PAL.W9); fill(b, 30, 172, 400, 8, PAL.P0);
  for (let i = 0; i < 400; i += 3) fill(b, 30 + i, 176, 1, 4, PAL.G5);
  bpt(b, 'NOLE v. MANALT ET AL.', 52, 84, PAL.N1); fill(b, 52, 104, 300, 2, PAL.N2);
  // the coffee cups on it (rings on the cover) — the staff's side table since February
  for (const cx of [300, 360]) { fill(b, cx, 28, 30, 44, PAL.P2); fill(b, cx, 40, 30, 10, PAL.C4); fill(b, cx + 27, 28, 3, 44, PAL.P0); fill(b, cx + 4, 24, 22, 4, PAL.D3); for (let i = 0; i < 30; i++) b.set(cx + i, 74, PAL.D4); }
  for (const [rx, ry] of [[90, 130], [150, 146]]) ellipse(rx, ry, 14, 5, (x, y) => { if (bayer(x, y) < 0.5) b.set(x, y, PAL.D4); });
  // the docket tab: yellow, sticking out of the side (a flick: it lifts a pixel), its words held for reading
  const lift = st.flick && st.flick > 0 && st.flick < 4 ? -2 : 0;
  fill(b, 300, 118 + lift, 176, 60, PAL.W7); fill(b, 300, 118 + lift, 176, 2, PAL.W8); fill(b, 300, 176 + lift, 176, 2, PAL.W5);
  pt(b, 'HEARING · JUN 12', 312, 128 + lift, PAL.N1); pt(b, 'MOTION TO', 312, 146 + lift, PAL.N1); pt(b, 'DISMISS', 312, 160 + lift, PAL.N1);
  void f;
};
void rect; void familyOf; void pw; void bpw; void dimRoom; void skinDown; void drawComplaint;
export type {Mas2Legs};
