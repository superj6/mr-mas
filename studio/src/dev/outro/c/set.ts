// MR. MAS — outro C: THE WALL RIGHT OF THE DESK, AFTER HOURS (a close set of the NopeAI lobby, NIGHT).
// The lobby's own materials and night light (shared/pixel/rooms/lobby.ts: limestone, rack pillar, brass, polished
// floor, the lit sign's cream pool, the rose window's cyan pool), re-set at a closer scale so the new DIRECTORY
// board can carry the credits in the 7-px face. Painted as (material, level) into a MatBuf and lit once; the
// sign face, its plates and the board's letters are flat on top so they stay crisp and readable.
//
// Frame contract (the room contract, setkit.ts): picture rows 0..202, the UI band 203..269 (band.ts).
//
// What is NEW here (local, nothing shared was edited):
//   the close sign     a copy of the room sign's design (cream light box, green safety rule, four lines, red digits:
//                      lobby.ts paintSign, the version sc 30 airs) at the kit plate's size (kits/props.ts digitPlate,
//                      16 x 22) with THREE plate slots (so 36, 275 and ∞ fit; the room wide has one slot: see notes)
//   the directory      black felt letter board, white push-in capitals, brass frame, 9 grooves (header + 8 rows).
//                      Second pass: 364 px wide (was 304) so every credit sits on ONE line; the values share one
//                      column and the dot leaders sit on one 4-px grid that stops at one x (the cold read saw a
//                      wrapped "RENDERED IN CODE" and 3-dot rows beside 40-dot rows as unfinished)
//   the spare box      kits/props.ts zeroBox's carton, redrawn at the sign plates' scale (the kit's box plates are
//                      10 x 14, smaller than the kit's own 16 x 22 sign plates)
import {Buf, rect, line, poly, bayer, hash, clamp} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {MatBuf, Lights, resolve} from '../../../shared/pixel/light';
import {text, textWidth, bigText, bigTextWidth} from '../../../shared/pixel/font';
import {micro, microWidth} from '../../../shared/pixel/cast/bosses';
import {LOBBY} from '../../../shared/pixel/rooms/lobby'; // registers the lb.* materials (and the night ambient below)
import {DirRow} from './text';

export const RH = 203;
export const G = {
  FLOOR_Y: 184,
  SKIRT_Y: 176,
  PILLAR_X1: 33,
  SIGN: {x: 174, y: 20, w: 132, h: 56},
  BOARD: {x: 58, y: 81, w: 364, h: 94},
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
/** the felt: rows of text (9 grooves at a 9-px pitch: 7-px caps, a 2-px groove) */
export const FELT = {x0: G.BOARD.x + 3, y0: G.BOARD.y + 3, x1: G.BOARD.x + G.BOARD.w - 4, y1: G.BOARD.y + G.BOARD.h - 4};
export const TEXT_X0 = FELT.x0 + 6, TEXT_X1 = FELT.x1 - 6;
export const ROW_PITCH = 9;
export const rowY = (i: number) => FELT.y0 + 5 + i * ROW_PITCH;
/** the credit rows' value column: one x for every value (the longest label, PICTURE · MUSIC, is 79 px, + 16) */
export const VALUE_X = TEXT_X0 + 79 + 16;
/** the dot leaders' grid: every dot on x = LEAD_END - 4k, so the dots stand in columns down the board */
export const LEAD_END = VALUE_X - 4;

export interface SetState {
  f: number;
  /** 0 = house lights on; -1 = the after-hours timer's one step down */
  house: number;
  /** the sign: 3 lit, 2 the flicker's half step */
  sign: 2 | 3;
  /** the spare box: how many plates stand in it (4 = the Ep1 box) and any extras tossed in */
  boxPlates: number;
  /** the extra, older plates tossed in on a reset week (Ep4): face-down backs */
  boxBacks?: number;
}

// ------------------------------------------------------------------ light (the lobby's NIGHT, at this framing)
const NIGHT_AMB = 2.1; // lobby.ts lobbyLights: night ambient
/** the two house downlights' x (either side of the board, clear of the sign): left by the rack pillar, right
 *  over the box of spare zeros */
const HOUSE_X = [40, 446];
const lights = (s: SetState): Lights => {
  const k = s.sign === 3 ? 1 : 0.6;
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

const paintBoard = (mb: MatBuf) => {
  const B = G.BOARD;
  rect(B.x + 2, B.y + 2, B.w, B.h, mb.shade(-1.2));
  // the brass frame (3 px): a lit outer edge, the body, a dark inner lip
  rect(B.x, B.y, B.w, B.h, mb.mat('lb.brass', 0.4));
  rect(B.x, B.y, B.w, 1, mb.shade(1.4));
  rect(B.x, B.y, 1, B.h, mb.shade(0.8));
  rect(B.x, B.y + B.h - 1, B.w, 1, mb.shade(-1));
  rect(B.x + B.w - 1, B.y, 1, B.h, mb.shade(-0.8));
  rect(B.x + 2, B.y + 2, B.w - 4, 1, mb.shade(-0.8));
  // the felt: black, a groove under every row (the letters' tabs sit in them)
  for (let y = FELT.y0; y <= FELT.y1; y++) {
    const r = (y - FELT.y0 - 5 + ROW_PITCH * 4) % ROW_PITCH; // 0..6 the letter rows, 7..8 the gap
    for (let x = FELT.x0; x <= FELT.x1; x++) mb.mat('black', r === 8 ? -0.6 : 0.5)(x, y);
  }
  rect(FELT.x0, FELT.y0, FELT.x1 - FELT.x0 + 1, 1, mb.shade(-1.2)); // under the frame's top lip
  // two brass screw heads in the frame's top rail
  for (const sx of [B.x + 12, B.x + B.w - 13]) { mb.mat('lb.brass', 2.2)(sx, B.y + 1); mb.mat('lb.brass', -0.6)(sx + 1, B.y + 1); }
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
  for (let k = 0; k < Math.min(4, s.boxPlates); k++) matPlate(mb, x + 2 + k * 8, y - 12 + (k % 2) * 2, '0');
  if (s.boxPlates >= 5) matPlate(mb, x + 22, y - 9, '0', 1.8); // the plate just dropped in, in front, 1 row lower
  // flaps, then the front face
  poly([x, y, x - 6, y - 7, x + 7, y - 7, x + 11, y], mb.mat('lb.box', 1.6));
  poly([x + w, y, x + w + 5, y - 8, x + w - 8, y - 8, x + w - 12, y], mb.mat('lb.box', 0.2));
  rect(x, y, w, h, mb.mat('lb.box', 0.9));
  rect(x, y, w, 1, mb.shade(1.4));
  rect(x + w - 6, y + 1, 6, h - 1, mb.shade(-1)); // its turned side
  rect(x, y + 7, w - 6, 1, mb.shade(-0.5)); // a tape seam
  // a reset week: two of the old plates didn't make it in (face down on the floor beside the box)
  if (backs) for (const [fx, fy] of [[x - 24, y + h - 3], [x - 12, y + h - 1]] as Array<[number, number]>) {
    rect(fx, fy, PLATE_W, 3, mb.mat('lb.sign', 0.6)); rect(fx, fy, PLATE_W, 1, mb.shade(1)); rect(fx + 1, fy + 3, PLATE_W, 1, mb.shade(-1.4));
  }
  const sink = new Buf(1, 1, 0);
  sink.set = (sx: number, sy: number) => mb.mat('black', 0.2)(sx, sy);
  const lab = '0 0 0';
  micro(sink, lab, x + Math.round((w - 6 - microWidth(lab)) / 2), y + 9, 0);
};

// ------------------------------------------------------------------ public: the resolved set
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
  void LOBBY;
};

// ------------------------------------------------------------------ flat layers on top of the lit set
/** A hung (or carried) plate: flat inks, crisp. `lit` = the light box behind it is at full. */
export const drawPlate = (b: Buf, x: number, y: number, d: string, lit = true, face?: number) => {
  const fc = face ?? (lit ? PAL.P2 : PAL.P1);
  rect(x, y, PLATE_W, PLATE_H, b.ink(PAL.N0));
  rect(x + 1, y + 1, PLATE_W - 2, PLATE_H - 2, b.ink(fc));
  rect(x + 1, y + PLATE_H - 2, PLATE_W - 2, 1, b.ink(PAL.P0));
  b.set(x + 4, y + 2, PAL.G3); b.set(x + 12, y + 2, PAL.G3); // the hook holes
  bigText(b, d, x + Math.round((PLATE_W - bigTextWidth(d)) / 2), y + 5, lit ? PAL.R2 : PAL.R1);
};
/** A plate mid-flip on its hooks (Ep10: it turns by itself): a held edge-on drawing, never a rotation. */
export const drawPlateFlip = (b: Buf, x: number, y: number) => {
  const cx = x + PLATE_W / 2 - 2;
  rect(cx, y, 5, PLATE_H, b.ink(PAL.N0));
  rect(cx + 1, y + 1, 3, PLATE_H - 2, b.ink(PAL.P1));
  rect(cx + 3, y + 1, 1, PLATE_H - 2, b.ink(PAL.P0));
  rect(cx + 1, y + 7, 1, 8, b.ink(PAL.R2));
};

/** A plate caught half-turned on its hooks (Ep10: it turns by itself): the face foreshortened to 9 of its 16
 *  columns (sampled, never scaled smooth) with its card edge showing on the far side, so the digit still reads.
 *  One held drawing, centred in the slot, whole pixels. */
export const drawPlateHalf = (b: Buf, x: number, y: number, d: string, lit = true) => {
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
export const drawSignWords = (b: Buf, lit: 2 | 3) => {
  ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'].forEach((l, i) => text(b, l, FACE.x0 + 4, FACE.y0 + 6 + i * 10, lit === 3 ? PAL.N1 : PAL.N2));
};

/** One line of board letters, character by character: per-letter offsets (a pushed-in letter a pixel out of line;
 *  the Ep10 letters still sliding into their grooves). Returns the x after the last glyph. */
export const letters = (b: Buf, s: string, x: number, y: number, col: number, off?: (i: number) => [number, number, number?] | null) => {
  let cx = x;
  [...s].forEach((ch, i) => {
    const w = ch === ' ' ? 3 : textWidth(ch);
    if (ch !== ' ') {
      const o = off ? off(i) : [0, 0];
      if (o) {
        const X = cx + o[0], Y = y + o[1];
        if (X >= FELT.x0 && X + w <= FELT.x1 + 1) { text(b, ch, X + 1, Y + 1, PAL.N0); text(b, ch, X, Y, o[2] ? PAL.P0 : col); }
      }
    }
    cx += w + 1;
  });
  return cx - 1;
};

export interface BoardOpts {
  /** per-row, per-letter offsets (null = the letter isn't on the board yet) */
  off?: (row: number, i: number) => [number, number, number?] | null;
  /** leader dots per row: 0..1 of them placed (Ep10: they arrive with the letters) */
  leaders?: (row: number) => number;
}
/** The directory's letters: the header centred, then each row (text.ts DirRow): the title row with its value
 *  right-aligned, the credit rows with their values on VALUE_X. Every dot leader sits on the LEAD_END grid, clear of
 *  the words by >= 3 px. */
export const drawBoardText = (b: Buf, rows: DirRow[], o: BoardOpts = {}) => {
  const INK = PAL.P1, DOT = PAL.P0;
  const put = (s: string, x: number, y: number, row: number, base = 0) => letters(b, s, x, y, INK, o.off ? (i) => o.off!(row, base + i) : undefined);
  const hdr = 'DIRECTORY';
  put(hdr, Math.round((TEXT_X0 + TEXT_X1 + 1 - textWidth(hdr)) / 2), rowY(0), 0);
  const leaders = (row: number, y: number, x0: number, x1: number) => {
    const dots: number[] = [];
    for (let dx = LEAD_END + 4 * Math.floor((x1 - LEAD_END) / 4); dx >= x0; dx -= 4) dots.push(dx);
    const share = o.leaders ? o.leaders(row) : 1;
    dots.reverse().slice(0, Math.round(dots.length * share)).forEach((dx) => b.set(dx, y + 6, DOT));
  };
  rows.forEach((r, k) => {
    const row = k + 1, y = rowY(row);
    if ('centre' in r) put(r.centre, Math.round((TEXT_X0 + TEXT_X1 + 1 - textWidth(r.centre)) / 2), y, row);
    else if ('title' in r) {
      const lx1 = put(r.title, TEXT_X0, y, row);
      const vx = TEXT_X1 + 1 - textWidth(r.value);
      put(r.value, vx, y, row, r.title.length);
      leaders(row, y, lx1 + 4, vx - 4);
    } else if ('label' in r) {
      const lx1 = put(r.label, TEXT_X0, y, row);
      put(r.value, VALUE_X, y, row, r.label.length);
      leaders(row, y, lx1 + 4, VALUE_X - 4);
    }
  });
};

/** The rows' letter geometry, for the readability checks (x0, x1, y of every row's text). */
export const boardExtents = (rows: DirRow[]) => {
  const out: Array<{row: number; x0: number; x1: number; y: number}> = [{row: 0, x0: 0, x1: 0, y: rowY(0)}];
  rows.forEach((r, k) => {
    if ('label' in r || 'title' in r) out.push({row: k + 1, x0: TEXT_X0, x1: TEXT_X1, y: rowY(k + 1)});
  });
  return out;
};

export {clamp};
