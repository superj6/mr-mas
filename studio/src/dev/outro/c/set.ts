// MR. MAS — outro C: THE WALL RIGHT OF THE DESK, AFTER HOURS (a close set of the NopeAI lobby, NIGHT).
// The lobby's own materials and night light (shared/pixel/rooms/lobby.ts: limestone, rack pillar, brass, polished
// floor, the lit sign's cream pool, the rose window's cyan pool), re-set at a closer scale so the DIRECTORY board
// can carry the credits. Painted as (material, level) into a MatBuf and lit once; the sign face, its plates and the
// board's letters are flat on top so they stay crisp and readable.
//
// Frame contract (the room contract, setkit.ts): picture rows 0..202, the UI band 203..269 (band.ts). The floor's
// last rows fall off into the band's black (a dithered shadow toward camera, fourth pass), so the band reads as the
// frame's dark foreground, not a slate stuck under the picture (the cold read: "a compliance slate stuck onto the
// scene").
//
// What is NEW here (local, nothing shared was edited):
//   the close sign     a copy of the room sign's design (cream light box, green safety rule, four lines, red digits:
//                      lobby.ts paintSign, the version sc 30 airs) at the kit plate's size (kits/props.ts digitPlate,
//                      16 x 22) with THREE plate slots (so 36, 275 and ∞ fit; the room wide has one slot: see notes).
//                      Fourth pass: the digits are the darker red (R1: ≈ 9:1 on the lit face; R2 measured 2.8:1 on
//                      the encode), and the sign can be switched OFF (the after-hours timer's second step)
//   the directory      fourth pass: a 288-px black felt letter board, white push-in capitals, a brass frame whose
//                      top rail carries an engraved DIRECTORY nameplate; one small row (the show + the file), THREE
//                      big rows in the 14-px display face, centred, no leaders (the credits: text.ts), one small egg
//                      row. The letters dim with the room when the lights go out
//   the spare box      kits/props.ts zeroBox's carton, redrawn at the sign plates' scale (the kit's box plates are
//                      10 x 14, smaller than the kit's own 16 x 22 sign plates)
import {Buf, rect, line, poly, bayer, hash, clamp} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {MatBuf, Lights, resolve} from '../../../shared/pixel/light';
import {text, textWidth, bigText, bigTextWidth} from '../../../shared/pixel/font';
import {micro, microWidth} from '../../../shared/pixel/cast/bosses';
import {LOBBY} from '../../../shared/pixel/rooms/lobby'; // registers the lb.* materials (and the night ambient below)
import {EpisodeOutro} from './text';

export const RH = 203;
export const G = {
  FLOOR_Y: 184,
  SKIRT_Y: 176,
  PILLAR_X1: 33,
  SIGN: {x: 174, y: 20, w: 132, h: 56},
  BOARD: {x: 96, y: 81, w: 288, h: 94},
  /** the carton's front face (top-left, size); it stands on the floor in front of the skirting, just right of the
   *  board (its left flap overlaps the board's bottom-right corner by a few px: the box is in front of the wall) */
  BOX: {x: 418, y: 182, w: 46, h: 16},
};
/** the sign's face and its plate well (3 slots, plates 16 x 22 on two hooks each) */
const FACE = {x0: G.SIGN.x + 2, y0: G.SIGN.y + 2, x1: G.SIGN.x + G.SIGN.w - 3, y1: G.SIGN.y + G.SIGN.h - 3};
export const WELL = {x: FACE.x1 - 59, y: FACE.y0 + 9, w: 57, h: 31};
export const PLATE_W = 16, PLATE_H = 22;
/** slot i's plate top-left when hung */
export const slotXY = (i: number): [number, number] => [WELL.x + 2 + i * 18, WELL.y + 5];
/** the brass frame: a 7-px top rail (it carries the engraved DIRECTORY nameplate), 3-px sides and bottom */
export const RAIL = 7;
/** the felt */
export const FELT = {x0: G.BOARD.x + 3, y0: G.BOARD.y + RAIL, x1: G.BOARD.x + G.BOARD.w - 4, y1: G.BOARD.y + G.BOARD.h - 4};
export const BOARD_CX = G.BOARD.x + G.BOARD.w / 2;
/** the rows' tops: the small head row (7-px face), the three big rows (14-px face, pitch 19), the small egg row */
export const HEAD_Y = FELT.y0 + 4;
export const BIG_Y = [FELT.y0 + 16, FELT.y0 + 35, FELT.y0 + 54];
export const EGG_Y = FELT.y0 + 73;

export interface SetState {
  f: number;
  /** 0 = house lights on; -1 = the after-hours timer's first step (the two downlights off) */
  house: number;
  /** the sign: 3 lit, 2 a held half step (the flicker; the tube dying), 0 off (the timer's second step) */
  sign: 0 | 2 | 3;
  /** the plate just dropped into the box (in front, one row lower), if any */
  dropped?: string | null;
  /** the extra, older plates tossed in on a reset week (Ep4): face-down backs */
  boxBacks?: number;
}

// ------------------------------------------------------------------ light (the lobby's NIGHT, at this framing)
const NIGHT_AMB = 2.1; // lobby.ts lobbyLights: night ambient
/** the two house downlights' x (either side of the board, clear of the sign): left by the rack pillar, right
 *  over the box of spare zeros */
const HOUSE_X = [40, 446];
const lights = (s: SetState): Lights => {
  const k = s.sign === 3 ? 1 : s.sign === 2 ? 0.6 : 0;
  const cx = G.SIGN.x + G.SIGN.w / 2, cy = G.SIGN.y + 26;
  return {
    amb: (x, y) => {
      let a = NIGHT_AMB + s.house * 0.6;
      if (y >= G.FLOOR_Y) a -= 0.3;
      const vx = (x - 240) / 240, vy = (y - 101) / 112;
      a -= Math.max(0, vx * vx + vy * vy - 0.55) * 1.6;
      return a;
    },
    cyan: (x, y) => {
      let L = 0;
      // the rack pillar's LEDs wash its side of the wall and the floor in front of it
      if (x > G.PILLAR_X1) { const d = (x - G.PILLAR_X1) / 62; if (d < 1) L = Math.max(L, (1 - d) * 0.42); }
      else L = Math.max(L, 0.3);
      // the rose window (off frame left, high) lays its server-cyan pool on the polished floor
      if (y >= G.FLOOR_Y) { const d = Math.hypot((x - 150) / 118, (y - 195) / 9); if (d < 1) L = Math.max(L, (1 - d) * 0.62); }
      return L;
    },
    warm: (x, y) => {
      let L = 0;
      // the HOUSE light (night level): two ceiling downlights scallop the limestone either side of the board and pool
      // on the floor. The after-hours timer (house -1, o180) switches them off: the light closes in on the count.
      if (s.house >= 0) for (const hx of HOUSE_X) {
        if (y < G.FLOOR_Y) {
          const w = 5 + (y - 6) * 0.46, u = (x - hx) / w, v = (y - 6) / 172;
          if (y > 6 && Math.abs(u) < 1 && v < 1) L = Math.max(L, 0.56 * Math.pow(1 - u * u, 0.7) * Math.pow(1 - v, 1.2) + (y < 13 ? 0.08 : 0));
        } else {
          const d = Math.hypot((x - hx) / 44, (y - G.FLOOR_Y - 8) / 9);
          if (d < 1) L = Math.max(L, Math.pow(1 - d, 1.2) * 0.4);
        }
      }
      // the lit light box: a band on the wall around it that falls long down the board, and a pool on the floor
      if (y < G.FLOOR_Y) {
        const d = Math.hypot((x - cx) / 172, (y - cy) / (y < cy ? 44 : 150));
        if (d < 1) L = Math.max(L, Math.pow(1 - d, 1.3) * 0.8 * k);
      } else {
        const d = Math.hypot((x - cx) / 230, (y - G.FLOOR_Y - 7) / 14);
        if (d < 1) L = Math.max(L, Math.pow(1 - d, 1.1) * 0.62 * k);
      }
      return L;
    },
    dither: 0.55,
  };
};

// ------------------------------------------------------------------ paint
const paintWall = (mb: MatBuf) => {
  rect(0, 0, 480, G.SKIRT_Y, mb.mat('lb.stone', 0));
  // coursed limestone at this scale: 24-px courses, 64-px blocks, staggered
  for (let y = 6 + 24; y < G.SKIRT_Y; y += 24) rect(0, y, 480, 1, mb.shade(-0.9));
  for (let c = 0, y0 = 6; y0 < G.SKIRT_Y; c++, y0 += 24) {
    const off = c % 2 ? 0 : 32;
    for (let x = off; x < 480; x += 64) rect(x, y0 + 1, 1, Math.min(23, G.SKIRT_Y - y0 - 1), mb.shade(-0.6));
  }
  // the string course (a moulding) across the top of frame
  rect(0, 0, 480, 4, mb.mat('lb.stone', 1.2));
  rect(0, 4, 480, 1, mb.mat('lb.stone', 1.8));
  rect(0, 5, 480, 1, mb.mat('lb.stoneDk', -1));
  // the skirting
  rect(0, G.SKIRT_Y, 480, G.FLOOR_Y - G.SKIRT_Y, mb.mat('lb.stoneDk', 0.6));
  rect(0, G.SKIRT_Y, 480, 1, mb.shade(1.6));
};

const paintFloor = (mb: MatBuf) => {
  const FY = G.FLOOR_Y;
  rect(0, FY, 480, RH - FY, mb.mat('lb.floor', 0.4));
  const VPY = -260;
  for (let xw = -600; xw <= 1080; xw += 44) { const x1 = 240 + ((xw - 240) * (RH - VPY)) / (FY - VPY); line(xw, FY, Math.round(x1), RH, mb.shade(-0.9)); }
  for (const y of [FY + 5, FY + 12]) rect(0, y, 480, 1, mb.shade(-0.9));
  for (let y = FY; y < RH; y++) {
    const row = y < FY + 5 ? 0 : y < FY + 12 ? 1 : 2;
    for (let x = 0; x < 480; x++) {
      const t = (y - VPY) / (FY - VPY), xw = 240 + (x - 240) / t;
      if ((Math.floor((xw + 600) / 44) + row) % 2) mb.shade(-0.5)(x, y);
    }
  }
  // the polish: the light box lies in it as a long pale streak, the pillar's LEDs as a cyan one
  for (let y = FY + 1; y < RH; y++) {
    const t = (y - FY) / (RH - FY);
    for (let x = 196; x < 286; x++) if (bayer(x, y) < 0.36 * (1 - t)) mb.shade(1.3)(x, y);
    for (let x = 3; x < 30; x++) if ((x % 6) < 3 && bayer(x, y) < 0.3 * (1 - t)) mb.shade(1)(x, y);
  }
};

const paintPillar = (mb: MatBuf, f: number) => {
  const x1 = G.PILLAR_X1;
  rect(0, 0, x1 + 1, G.FLOOR_Y, mb.mat('lb.rack', 0.4));
  rect(x1, 0, 1, G.FLOOR_Y, mb.shade(1.6)); // the lit edge toward the sign
  rect(x1 - 1, 0, 1, G.FLOOR_Y, mb.shade(0.6));
  // the stone base
  rect(0, G.SKIRT_Y - 4, x1 + 4, G.FLOOR_Y - G.SKIRT_Y + 4, mb.mat('lb.stone', 0.6));
  rect(0, G.SKIRT_Y - 4, x1 + 4, 1, mb.shade(1.2));
  // rack units: seams every 5 px, four LED columns blinking on their own clocks (the lobby's rule)
  for (let y = 8; y < G.SKIRT_Y - 6; y += 5) {
    rect(1, y, x1 - 2, 1, mb.shade(-1));
    for (let k = 0; k < 4; k++) {
      const lx = 5 + k * 7;
      const on = hash(lx, y, Math.floor((f + lx * 7 + y * 3) / (5 + ((lx + y) % 6))));
      mb.emit(on < 0.4 ? PAL.C6 : on < 0.5 ? PAL.L3 : on < 0.56 ? PAL.W6 : PAL.N2)(lx, y + 2);
    }
  }
};

const paintSignBox = (mb: MatBuf, s: SetState) => {
  const S = G.SIGN;
  rect(S.x + 2, S.y + 2, S.w, S.h, mb.shade(-1.4)); // its shadow on the wall
  rect(S.x, S.y, S.w, S.h, mb.mat('metal', -0.4));
  rect(S.x, S.y, S.w, 1, mb.shade(1.6));
  rect(S.x, S.y + S.h - 1, S.w, 1, mb.shade(-1));
  if (s.sign === 0) {
    // OFF (the timer's second step): the face is a dead diffuser lit only by the room, the rule a dull green line
    rect(FACE.x0, FACE.y0, FACE.x1 - FACE.x0 + 1, FACE.y1 - FACE.y0 + 1, mb.mat('lb.sign', 0.6));
    rect(FACE.x0, FACE.y0, FACE.x1 - FACE.x0 + 1, 2, mb.mat('plant', 0.6));
    rect(WELL.x, WELL.y, WELL.w, WELL.h, mb.mat('black', 0));
    rect(WELL.x, WELL.y + WELL.h, WELL.w, 1, mb.mat('lb.sign', 0.4));
    for (let i = 0; i < 3; i++) {
      const [px] = slotXY(i);
      for (const hx of [px + 3, px + 11]) rect(hx, WELL.y + 2, 2, 4, mb.mat('metal', 0.6));
    }
    return;
  }
  // the lit face (emissive): cream, its top row hotter; the flicker's half step is a dither of two creams
  for (let y = FACE.y0; y <= FACE.y1; y++)
    for (let x = FACE.x0; x <= FACE.x1; x++) {
      if (s.sign === 3) mb.emit(y === FACE.y0 + 2 ? PAL.P2 : PAL.P1)(x, y);
      else mb.emit(bayer(x, y) < 0.5 ? PAL.P1 : PAL.P0)(x, y);
    }
  rect(FACE.x0, FACE.y0, FACE.x1 - FACE.x0 + 1, 2, mb.emit(s.sign === 3 ? PAL.L2 : PAL.L1)); // the green safety rule
  // the plate well: a dark recess, a shadowed lip along its top, two hooks per slot
  rect(WELL.x, WELL.y, WELL.w, WELL.h, mb.emit(PAL.N2));
  rect(WELL.x, WELL.y, WELL.w, 1, mb.emit(PAL.N0));
  rect(WELL.x, WELL.y + 1, 1, WELL.h - 1, mb.emit(PAL.N1));
  rect(WELL.x, WELL.y + WELL.h, WELL.w, 1, mb.emit(s.sign === 3 ? PAL.P2 : PAL.P1));
  for (let i = 0; i < 3; i++) {
    const [px] = slotXY(i);
    for (const hx of [px + 3, px + 11]) { rect(hx, WELL.y + 2, 2, 4, mb.emit(PAL.G4)); mb.emit(PAL.G6)(hx, WELL.y + 2); }
  }
};

const NAMEPLATE = 'DIRECTORY';
const paintBoard = (mb: MatBuf) => {
  const B = G.BOARD;
  rect(B.x + 2, B.y + 2, B.w, B.h, mb.shade(-1.2));
  // the brass frame: a lit outer edge, the body, a dark inner lip; the top rail is RAIL px deep
  rect(B.x, B.y, B.w, B.h, mb.mat('lb.brass', 0.4));
  rect(B.x, B.y, B.w, 1, mb.shade(1.4));
  rect(B.x, B.y, 1, B.h, mb.shade(0.8));
  rect(B.x, B.y + B.h - 1, B.w, 1, mb.shade(-1));
  rect(B.x + B.w - 1, B.y, 1, B.h, mb.shade(-0.8));
  rect(B.x + 2, B.y + RAIL - 1, B.w - 4, 1, mb.shade(-0.8));
  // the engraved nameplate, centred in the top rail: a brighter brass plate, the word cut in dark
  const nw = microWidth(NAMEPLATE) + 8, nx = Math.round(BOARD_CX - nw / 2);
  rect(nx, B.y + 1, nw, RAIL - 2, mb.mat('lb.brass', 1.3));
  rect(nx, B.y + 1, nw, 1, mb.shade(0.8));
  rect(nx + nw - 1, B.y + 1, 1, RAIL - 2, mb.shade(-0.8));
  const cut = new Buf(1, 1, 0);
  cut.set = (sx: number, sy: number) => mb.mat('lb.brass', -1.2)(sx, sy);
  micro(cut, NAMEPLATE, nx + 4, B.y + 1, 0);
  // the felt: black, finely ribbed (a groove every 3 px, where the letters' tabs sit)
  for (let y = FELT.y0; y <= FELT.y1; y++)
    for (let x = FELT.x0; x <= FELT.x1; x++) mb.mat('black', (y - FELT.y0) % 3 === 2 ? -0.4 : 0.5)(x, y);
  rect(FELT.x0, FELT.y0, FELT.x1 - FELT.x0 + 1, 1, mb.shade(-1.2)); // under the rail's lip
  // two brass screw heads in the top rail
  for (const sx of [B.x + 8, B.x + B.w - 9]) { mb.mat('lb.brass', 2.2)(sx, B.y + 3); mb.mat('lb.brass', -0.6)(sx + 1, B.y + 3); }
};

/** a digit plate drawn into the MatBuf (the spare ones in the box, lit by the room) */
const matPlate = (mb: MatBuf, x: number, y: number, d: string | null, lvl = 1.4) => {
  rect(x, y, PLATE_W, PLATE_H, mb.mat('lb.sign', lvl));
  rect(x, y, PLATE_W, 1, mb.shade(1.2));
  rect(x + PLATE_W - 1, y, 1, PLATE_H, mb.shade(-1.2));
  if (d === null) { rect(x + 2, y + 3, PLATE_W - 4, PLATE_H - 6, mb.mat('lb.box', 0.6)); return; } // a back: bare card
  const sink = new Buf(1, 1, 0);
  sink.set = (sx: number, sy: number) => mb.mat('red', 1.3)(sx, sy);
  bigText(sink, d, x + Math.round((PLATE_W - bigTextWidth(d)) / 2), y + 5, 0);
};

const paintBox = (mb: MatBuf, s: SetState) => {
  const {x, y, w, h} = G.BOX;
  // its shadow on the floor, then the plates standing in it (behind the front face), back to front
  for (let yy = y + h - 1; yy < y + h + 3; yy++) for (let xx = x - 2; xx < x + w + 5; xx++) mb.shade(-1.4)(xx, yy);
  const backs = s.boxBacks ?? 0;
  for (let k = 0; k < backs; k++) matPlate(mb, x - 3 + ((k * 13) % 34), y - 19 + (k % 3) * 3, null, 1.1);
  for (let k = 0; k < 4; k++) matPlate(mb, x + 2 + k * 8, y - 12 + (k % 2) * 2, '0');
  if (s.dropped) matPlate(mb, x + 22, y - 9, s.dropped, 1.8); // the plate just dropped in, in front, 1 row lower
  // flaps, then the front face
  poly([x, y, x - 6, y - 7, x + 7, y - 7, x + 11, y], mb.mat('lb.box', 1.6));
  poly([x + w, y, x + w + 5, y - 8, x + w - 8, y - 8, x + w - 12, y], mb.mat('lb.box', 0.2));
  rect(x, y, w, h, mb.mat('lb.box', 0.9));
  rect(x, y, w, 1, mb.shade(1.4));
  rect(x + w - 6, y + 1, 6, h - 1, mb.shade(-1)); // its turned side
  rect(x, y + 7, w - 6, 1, mb.shade(-0.5)); // a tape seam
  // a reset week: two of the old plates didn't make it in (face down on the floor beside the box)
  // (fourth pass: set further back on the floor, clear of the floor's fall-off into the band)
  if (backs) for (const [fx, fy] of [[x - 26, y + 8], [x - 13, y + 10]] as Array<[number, number]>) {
    rect(fx, fy, PLATE_W, 3, mb.mat('lb.sign', 0.6)); rect(fx, fy, PLATE_W, 1, mb.shade(1)); rect(fx + 1, fy + 3, PLATE_W, 1, mb.shade(-1.4));
  }
  const sink = new Buf(1, 1, 0);
  sink.set = (sx: number, sy: number) => mb.mat('black', 0.2)(sx, sy);
  const lab = '0 0 0';
  micro(sink, lab, x + Math.round((w - 6 - microWidth(lab)) / 2), y + 9, 0);
};

// ------------------------------------------------------------------ public: the resolved set
/** the floor's last rows fall off into the band's black: rows FALL_Y0..RH-1, a Bayer ramp toward camera */
const FALL_Y0 = 194;
/** Paint + light the set into rows 0..202 of fb. */
export const drawSet = (fb: Buf, s: SetState) => {
  const mb = new MatBuf(480, RH);
  paintWall(mb);
  paintPillar(mb, s.f);
  paintFloor(mb);
  paintSignBox(mb, s);
  paintBoard(mb);
  paintBox(mb, s);
  resolve(mb, lights(s), fb, 0);
  for (let y = FALL_Y0; y < RH; y++) {
    const t = (y - FALL_Y0 + 1) / (RH - FALL_Y0 + 1);
    for (let x = 0; x < 480; x++) if (bayer(x, y) < t) fb.set(x, y, PAL.N0);
  }
  void LOBBY;
};

// ------------------------------------------------------------------ flat layers on top of the lit set
/** how a flat layer is lit: 3 the light box at full, 2 its half step, 0 the sign off (the room at night only) */
export type Lit = 0 | 2 | 3;
/** A hung (or carried) plate: flat inks, crisp. The digit is the darker red (R1) on the lit face: ≈ 9:1. */
export const drawPlate = (b: Buf, x: number, y: number, d: string, lit: Lit | boolean = 3, face?: number) => {
  const L: Lit = lit === true ? 3 : lit === false ? 2 : lit;
  const fc = face ?? (L === 3 ? PAL.P2 : L === 2 ? PAL.P1 : PAL.G2);
  rect(x, y, PLATE_W, PLATE_H, b.ink(PAL.N0));
  rect(x + 1, y + 1, PLATE_W - 2, PLATE_H - 2, b.ink(fc));
  rect(x + 1, y + PLATE_H - 2, PLATE_W - 2, 1, b.ink(L === 0 ? PAL.G1 : PAL.P0));
  b.set(x + 4, y + 2, L === 0 ? PAL.N1 : PAL.G3); b.set(x + 12, y + 2, L === 0 ? PAL.N1 : PAL.G3); // the hook holes
  bigText(b, d, x + Math.round((PLATE_W - bigTextWidth(d)) / 2), y + 5, L === 0 ? PAL.R0 : PAL.R1);
};

/** A plate caught half-turned on its hooks (Ep10: it turns by itself): the face foreshortened to 9 of its 16
 *  columns (sampled, never scaled smooth) with its card edge showing on the far side, so the digit still reads.
 *  One held drawing, centred in the slot, whole pixels. */
export const drawPlateHalf = (b: Buf, x: number, y: number, d: string, lit: Lit = 3) => {
  const src = new Buf(PLATE_W, PLATE_H, 0);
  drawPlate(src, 0, 0, d, lit);
  const HW = 9, x0 = x + Math.floor((PLATE_W - HW - 2) / 2);
  for (let i = 0; i < HW; i++) {
    const sx = Math.min(PLATE_W - 1, Math.floor(((i + 0.5) * PLATE_W) / HW));
    for (let j = 0; j < PLATE_H; j++) b.set(x0 + i, y + j, src.get(sx, j));
  }
  // the card's thickness on the turned-away side: a 2-px edge, the far lip darker
  rect(x0 + HW, y, 2, PLATE_H, b.ink(PAL.N0));
  rect(x0 + HW, y + 1, 1, PLATE_H - 2, b.ink(PAL.P0));
};

/** The sign's lettering (four lines, as the room sign sets them). */
export const drawSignWords = (b: Buf, lit: Lit) => {
  ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'].forEach((l, i) => text(b, l, FACE.x0 + 4, FACE.y0 + 6 + i * 10, lit === 3 ? PAL.N1 : lit === 2 ? PAL.N2 : PAL.N1));
};

/** One line of board letters, character by character, in the small (7-px) or big (14-px) face, each with a 1-px
 *  shadow on the felt. `off` gives per-letter offsets (the Ep10 letters still sliding into their grooves: [dx, dy,
 *  dim?]; null = not on the board yet). */
export const letters = (b: Buf, s: string, x: number, y: number, col: number, big: boolean, off?: (i: number) => [number, number, number?] | null) => {
  const sp = big ? 8 : 4, tw = big ? bigTextWidth : textWidth, draw = big ? bigText : text;
  let cx = x;
  [...s].forEach((ch, i) => {
    const w = ch === ' ' ? sp - (big ? 2 : 1) : tw(ch);
    if (ch !== ' ') {
      const o = off ? off(i) : [0, 0];
      if (o) {
        const X = cx + o[0], Y = y + o[1];
        if (X >= FELT.x0 && X + w <= FELT.x1 + 1) { draw(b, ch, X + 1, Y + 1, PAL.N0); draw(b, ch, X, Y, o[2] ? PAL.P0 : col); }
      }
    }
    cx += w + (big ? 2 : 1);
  });
  return cx;
};

export interface BoardOpts {
  /** the letters' ink: the white letters under the house light / the sign's glow, or dimmed with the room */
  ink?: number;
  /** per-row (0 head, 1-3 big, 4 egg), per-letter offsets (null = the letter isn't on the board yet) */
  off?: (row: number, i: number) => [number, number, number?] | null;
}
/** the x a centred row starts at */
export const rowX = (s: string, big: boolean) => Math.round(BOARD_CX - (big ? bigTextWidth(s) : textWidth(s)) / 2);
/** The directory's letters: the small head row, the three big rows, the small egg row, all centred. */
export const drawBoardText = (b: Buf, ep: EpisodeOutro, o: BoardOpts = {}) => {
  const ink = o.ink ?? PAL.P1;
  const put = (s: string, y: number, row: number, big: boolean) =>
    letters(b, s, rowX(s, big), y, ink, big, o.off ? (i) => o.off!(row, i) : undefined);
  put(ep.head, HEAD_Y, 0, false);
  ep.credits.forEach((c, k) => put(c, BIG_Y[k], k + 1, true));
  if (ep.egg) put(ep.egg, EGG_Y, 4, false);
};

export {clamp};
