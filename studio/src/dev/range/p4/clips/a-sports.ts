// MR. MAS · prototype 4 · 4a · P4 SPORTS · Draft Night (5.A, Ep5 #10). Reel frames p0-179.
//   p0-14    the boardroom at night (rooms/boardroom-plate.ts), the draft small on the wall TV (its spill on the wall
//            pulses with the stadium's camera flashes), Mas at the table watching it, his glass still
//   p15-29   cut in on the beat: HIS TV at native density, three times closer, the draft playing on it
//   p30      IN: cut to the stadium feed on the beat
//   p30-149  the fixed stage camera (a-feed.ts)
//   p150-179 OUT: snap back to the boardroom, the feed small again. His eyes drop from the TV to the table (p160),
//            his hand goes to his phone (p165) and it lights (p169). Land on his face, the glass beside him
import {Buf, rect, bayer} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {drawBoardPlate, drawBoardPlateTable, drawBoardPlateFront, BPLATE, BoardPlateOpts} from '../../../../shared/pixel/rooms/boardroom-plate';
import {drawMasMedium, masMediumHand, MAS_MEDIUM_DEFAULT, MasMediumState} from '../../../../shared/pixel/cast/mas-medium';
import {miniature} from '../passes/device';
import {WIDE, View} from '../passes/present';
import {drawFeed, feedFlash, FEED_W, FEED_H} from './a-feed';

export const A0 = 0, A_INSERT = 15, A_IN = 30, A_OUT = 150, A1 = 180;
/** the wall TV (outer frame) and its picture (inner) */
export const TV = {x0: 300, y0: 32, w: 100, h: 46, ix: 303, iy: 35, iw: 94, ih: 40};

const PLATE: BoardPlateOpts = {vignette: true, door: 0};

/** Mas's water glass on the boardroom table: one flat row of water line, never a ripple (in any pass) */
export const drawGlassBoard = (b: Buf, x: number, y: number) => {
  const w = 5, h = 12;
  // its shadow on the walnut and the pendant's cyan in it
  for (let i = -1; i < w + 2; i++) b.set(x + i, y + h + 1, stepColor(b.get(x + i, y + h + 1), -2));
  for (let j = 0; j < h; j++) {
    b.set(x, y + j, PAL.C5);
    b.set(x + w - 1, y + j, PAL.G3);
    for (let i = 1; i < w - 1; i++) b.set(x + i, y + j, j > 3 ? (i === 1 ? PAL.C6 : PAL.C4) : PAL.G2);
  }
  for (let i = 1; i < w - 1; i++) b.set(x + i, y + 4, PAL.C8); // the water line: one flat row
  for (let i = 0; i < w; i++) b.set(x + i, y + h, PAL.G2);
  b.set(x + 1, y + 1, PAL.C7);
};

/** the wall TV: bezel, the feed area-averaged into the panel, its spill on the slats below and around */
const drawTV = (b: Buf, feed: Buf, flash = false) => {
  const T = TV;
  // spill: the lit panel lifts the wall a rung in a soft halo (ordered seam, the only allowed gradient)
  for (let y = T.y0 - 8; y < T.y0 + T.h + 14; y++) for (let x = T.x0 - 12; x < T.x0 + T.w + 12; x++) {
    const dx = x < T.x0 ? T.x0 - x : x >= T.x0 + T.w ? x - (T.x0 + T.w - 1) : 0;
    const dy = y < T.y0 ? T.y0 - y : y >= T.y0 + T.h ? y - (T.y0 + T.h - 1) : 0;
    if (!dx && !dy) continue;
    const d = Math.hypot(dx / 12, dy / 14);
    if (d < 1 && bayer(x, y) < (1 - d) * (flash ? 1.1 : 0.8)) b.set(x, y, stepColor(b.get(x, y), flash && d < 0.5 ? 2 : 1));
  }
  rect(T.x0, T.y0, T.w, T.h, b.ink(PAL.N0));
  rect(T.x0 + 1, T.y0 + 1, T.w - 2, 1, b.ink(PAL.G1));
  rect(T.x0 + 1, T.y0 + T.h - 2, T.w - 2, 1, b.ink(PAL.N1));
  miniature(feed, 0, 0, FEED_W, FEED_H, b, T.ix, T.iy, T.iw, T.ih);
  // the panel's glass: one faint sheen line across the top corner
  for (let i = 0; i < 14; i++) b.set(T.ix + T.iw - 18 + i, T.iy + i, stepColor(b.get(T.ix + T.iw - 18 + i, T.iy + i), 1));
  b.set(T.x0 + T.w - 5, T.y0 + T.h - 2, PAL.C6); // the power LED
  // the wall mount's shadow under the set
  rect(T.x0 + 6, T.y0 + T.h, T.w - 12, 1, b.ink(PAL.N0));
};

/** his phone on the table, face down until it lights (the landing's one action) */
const drawPhone = (b: Buf, x: number, y: number, lit: boolean) => {
  rect(x - 5, y - 1, 11, 4, b.ink(PAL.N0));
  rect(x - 4, y - 1, 9, 1, b.ink(lit ? PAL.C7 : PAL.G1));
  if (lit) {
    rect(x - 4, y, 9, 2, b.ink(PAL.C5));
    for (let j = -3; j <= 5; j++) for (let i = -10; i <= 10; i++) {
      const d = Math.hypot(i / 10, j / 5);
      if (d < 1 && d > 0.45 && bayer(x + i, y + j) < (1 - d) * 0.9) b.set(x + i, y + j, stepColor(b.get(x + i, y + j), 1));
    }
  }
};

/** Mas's pose through 4a: watching the TV; after the feed, his eyes drop to the table, his hand goes to the phone */
const masAt = (f: number): Partial<MasMediumState> => {
  if (f < A_OUT) return {look: -1};
  if (f < 160) return {look: -1};
  if (f < 165) return {look: 0, head: 'down', lid: 1};
  return {look: 0, head: 'down', lid: 1, arm: 'phone'};
};
export const PHONE_LIT = 169;

/** the boardroom shot: plate, TV, Mas (facing the TV, its light on him), the glass, his phone, the front layer */
export const drawBoardroomShot = (b: Buf, f: number) => {
  drawBoardPlate(b, f, PLATE);
  const feed = new Buf(FEED_W, FEED_H, PAL.N0);
  drawFeed(feed, f);
  drawTV(b, feed, feedFlash(f));
  const [mx, my] = BPLATE.left.mas;
  const st: MasMediumState = {...MAS_MEDIUM_DEFAULT, light: 'board', look: -1, ...masAt(f)};
  const hand = masMediumHand(mx, my, 'phone', 'L', true) ?? [mx + 70, my + 100];
  drawMasMedium(b, mx, my, st, {flip: true, desk: (bb) => {
    drawBoardPlateTable(bb, f, PLATE);
    for (let x = TV.ix; x < TV.ix + TV.iw; x += 1) {
      const y = BPLATE.tableY + 6;
      if (bayer(x, y) < 0.45) bb.set(x, y, stepColor(feed.get(Math.floor(((x - TV.ix) * FEED_W) / TV.iw), 120), -2));
    }
    drawGlassBoard(bb, 158, BPLATE.tableY - 3);
    drawPhone(bb, hand[0] + 1, hand[1] + 2, f >= PHONE_LIT);
  }});
  drawBoardPlateFront(b, f, PLATE);
};

// ------------------------------------------------------------------ the TV, closer (the door in)
/**
 * The cut-in on the beat: the wall TV at native density, three times the wide's size (the camera has moved closer;
 * nothing is magnified). The slatted wall at the new distance (a slat every 30 px), the TV's glow on it, the table's
 * cyan uplight low, the edge of the framed charter at the right, and on the panel's glass the pendant bar's faint
 * reflection and one sheen. The feed plays on it, area-averaged to the panel: the draft is on HIS television.
 */
const INS = {x: 90, y: 30, w: 300, h: 138, bez: 9};
const drawTVInsert = (b: Buf, f: number) => {
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) {
    const u = ((x - INS.x) % 30 + 30) % 30;
    let c = u < 6 ? PAL.N0 : u < 9 ? PAL.N2 : PAL.N1;
    if (y > 150 && bayer(x, y) < (y - 150) / 70) c = u < 6 ? PAL.C0 : PAL.C1;
    if (y < 16 && x < 260 && bayer(x, y) < (16 - y) / 30) c = PAL.C0;
    b.set(x, y, c);
  }
  // the charter's frame at the right edge (walnut, a lit inner lip), its seal's red just in frame
  rect(452, 12, 28, 118, b.ink(PAL.D2)); rect(452, 12, 3, 118, b.ink(PAL.W3)); rect(458, 18, 22, 106, b.ink(PAL.N1));
  rect(460, 22, 20, 1, b.ink(PAL.P0)); rect(460, 30, 20, 1, b.ink(PAL.P0));
  for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) if (i * i + j * j < 36) b.set(474 + i, 108 + j, i * i + j * j < 12 ? PAL.R2 : PAL.R1);
  // the TV's glow on the wall
  for (let y = INS.y - 26; y < INS.y + INS.h + 30; y++) for (let x = INS.x - 36; x < INS.x + INS.w + 36; x++) {
    const dx = x < INS.x ? INS.x - x : x >= INS.x + INS.w ? x - INS.x - INS.w : 0, dy = y < INS.y ? INS.y - y : y >= INS.y + INS.h ? y - INS.y - INS.h : 0;
    if (!dx && !dy) continue;
    const d = Math.hypot(dx / 36, dy / 30);
    if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, stepColor(b.get(x, y), 1));
  }
  rect(INS.x, INS.y, INS.w, INS.h, b.ink(PAL.N0));
  rect(INS.x + 2, INS.y + 2, INS.w - 4, 1, b.ink(PAL.G1));
  rect(INS.x + 2, INS.y + INS.h - 3, INS.w - 4, 1, b.ink(PAL.N1));
  const feed = new Buf(FEED_W, FEED_H, PAL.N0);
  drawFeed(feed, f);
  const px = INS.x + INS.bez, py = INS.y + INS.bez, pw = INS.w - INS.bez * 2, ph = INS.h - INS.bez * 2;
  miniature(feed, 0, 0, FEED_W, FEED_H, b, px, py, pw, ph);
  // the glass: the pendant bar's reflection as a faint dashed line near the top, one sheen across the top-right corner
  for (let x = px + 12; x < px + 190; x++) if (x % 4 !== 0) b.set(x, py + 5, stepColor(b.get(x, py + 5), 1));
  for (let i = 0; i < 40; i++) for (let w = 0; w < 3; w++) { const x = px + pw - 52 + i + w, y = py + i; if (y < py + ph) b.set(x, y, stepColor(b.get(x, y), 1)); }
  b.set(INS.x + INS.w - 14, INS.y + INS.h - 5, PAL.C6); b.set(INS.x + INS.w - 13, INS.y + INS.h - 5, PAL.C6); // power LED
  rect(INS.x + 18, INS.y + INS.h, INS.w - 36, 3, b.ink(PAL.N0)); // the mount's shadow
};

export const clipA = (f: number, room: Buf): {view: View} => {
  if (f >= A_IN && f < A_OUT) { drawFeed(room, f); return {view: WIDE}; }
  if (f >= A_INSERT && f < A_IN) { drawTVInsert(room, f); return {view: WIDE}; }
  drawBoardroomShot(room, f);
  return {view: WIDE};
};
