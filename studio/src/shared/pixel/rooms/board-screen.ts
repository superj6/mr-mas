// MR. MAS — shared room: THE BOARDROOM'S WALL SCREEN, CLOSE (PLATE-BOARD-SCREEN; Ep1 Act Four v5 art pass; new file,
// owned by the v5 art pass). The screen on the boardroom wall at OTS and two-shot scale, bezel in frame, with ALYI's
// reflection in its glass (by day the window isn't dark yet, so the screen's glass is where he lives):
//   drawBoardScreenOTS   S4.09 [OTS] over Neleh's right shoulder (cast/neleh-ots.ts) onto the screen, SUNDAY BY DAY:
//                        the lobby camera's feed pillarboxed at 1:1 (kits/lobby-feed.ts, 224 x 168; 1.K stays at bezel
//                        size), his post in the feed's corner the right way up (kits/post-card.ts 'notify'), and
//                        Alyi's reflection lip-synced in the dark left bar of the glass
//   drawBoardScreen2S    S4.13d [2S] at night: NELEH medium at the right (her pen stops: the marker still, mid-air),
//                        the wall screen at the left with Alyi's reflection looking at the SLATE DOOR beyond (not at
//                        his own doorway, for once: cast/alyi-v5.ts alyiReflectionLook), the door open in the wall
//                        between them in slate light
// The wall around the screen is the boardroom's (its slats, its day or night light), painted here at this scale.
import {Buf, rect, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg, Img} from '../figure';
import {drawNelehShoulderR, NelehOtsState, NELEH_OTS_DEFAULT} from '../cast/neleh-ots';
import {drawNelehMedium, NelehMediumState, NELEH_MEDIUM_DEFAULT} from '../cast/neleh-medium';
import {alyiReflectionLook, AlyiLookDir} from '../cast/alyi-v5';
import type {Viseme} from '../cast/talk';
import {FEED_W, FEED_H} from '../kits/lobby-feed';

const RH = 203;
/** the screen (glass) rect in the OTS, and the feed's window inside it (pillarboxed) */
export const BSCREEN = {
  ots: {glass: {x: 30, y: 10, w: 368, h: 180}, feed: {x: 102, y: 16, w: FEED_W, h: FEED_H}, alyi: {x: -18, y: 16}},
  two: {glass: {x: 14, y: 14, w: 250, h: 142}, alyi: {x: 70, y: 18}, door: {x0: 300, x1: 340, y0: 34, y1: 150}},
};

const wall = (b: Buf, time: 'day' | 'night', slate = false) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const slat = x % 12 === 0;
    const base = slate ? (time === 'day' ? PAL.G2 : PAL.G1) : time === 'day' ? PAL.D2 : PAL.D1;
    const lit = time === 'day' ? 1 - Math.abs(x - 90) / 520 : 0.35;
    let c = base;
    if (bayer(x, y) < lit * 0.35) c = stepColor(c, 1);
    if (slat) c = stepColor(c, -1);
    b.set(x, y, c);
  }
};
/** the glass: its bezel, its own dark, the reflection, the sheen streaks (fixed to the glass) */
const glass = (b: Buf, g: {x: number; y: number; w: number; h: number}) => {
  rect(g.x - 6, g.y - 6, g.w + 12, g.h + 12, b.ink(PAL.N0));
  rect(g.x - 5, g.y - 5, g.w + 10, g.h + 10, b.ink(PAL.G1));
  rect(g.x - 5, g.y - 5, g.w + 10, 1, b.ink(PAL.G3));
  rect(g.x, g.y, g.w, g.h, b.ink(PAL.N0));
  b.set(g.x + g.w - 4, g.y + g.h + 3, PAL.L3); // the power LED
};
const sheen = (b: Buf, g: {x: number; y: number; w: number; h: number}) => {
  for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) {
    const u = i + j * 0.6;
    if ((u > 40 && u < 42) || (u > 52 && u < 53)) { const X = g.x + i, Y = g.y + j; if (bayer(X, Y) < 0.5) b.set(X, Y, stepColor(b.get(X, Y), 1)); }
  }
};
/** Alyi's reflection over the glass: only where the glass is dark does it show (a lit feed washes him out) */
const reflect = (b: Buf, img: Img, x: number, y: number, g: {x: number; y: number; w: number; h: number}) => {
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const v = img.c[j * img.w + i];
    if (v < 0) continue;
    const X = x + i, Y = y + j;
    if (X < g.x || Y < g.y || X >= g.x + g.w || Y >= g.y + g.h) continue;
    const under = b.get(X, Y);
    if (under === PAL.N0 || under === PAL.N1) b.set(X, Y, v);
  }
};

export interface BoardScreenOTSState {
  /** the feed (FEED_W x FEED_H), e.g. drawLobbyFeed into a Buf that size; null = the dark glass */
  feed?: Buf | null;
  /** Alyi's reflection: mouth (lip-sync), look; null = none */
  alyi?: {mouth?: Viseme; look?: AlyiLookDir} | null;
  neleh?: Partial<NelehOtsState> | null;
  /** a card over the feed's corner (the post, the right way up): drawn by the caller into the feed buffer */
  f?: number;
}
export const drawBoardScreenOTS = (b: Buf, f: number, s: BoardScreenOTSState = {}) => {
  wall(b, 'day');
  const G = BSCREEN.ots;
  glass(b, G.glass);
  if (s.feed) for (let y = 0; y < G.feed.h; y++) for (let x = 0; x < G.feed.w; x++) b.set(G.feed.x + x, G.feed.y + y, s.feed.get(x, y));
  if (s.alyi !== null) {
    const img = alyiReflectionLook({mouth: s.alyi?.mouth ?? 'rest', eyes: 'open', t: f}, s.alyi?.look ?? 'ahead');
    reflect(b, img, G.glass.x + G.alyi.x, G.glass.y + G.alyi.y, G.glass);
  }
  sheen(b, G.glass);
  if (s.neleh !== null) drawNelehShoulderR(b, 494, RH, {...NELEH_OTS_DEFAULT, light: 'screen', ...s.neleh}, f);
};

export interface BoardScreen2SState {
  neleh?: Partial<NelehMediumState>;
  alyi?: {mouth?: Viseme; look?: AlyiLookDir} | null;
  /** the slate door: 'open' (slate light) | 'shut' */
  door?: 'open' | 'shut';
  /** the call dimmed on the screen behind the reflection (a faint grid), true by default */
  call?: boolean;
}
export const drawBoardScreen2S = (b: Buf, f: number, s: BoardScreen2SState = {}) => {
  wall(b, 'night', true);
  const T = BSCREEN.two;
  // the slate door beyond, in the wall between the screen and Neleh
  const d = T.door;
  rect(d.x0 - 3, d.y0 - 3, d.x1 - d.x0 + 6, d.y1 - d.y0 + 3, b.ink(PAL.G0));
  for (let y = d.y0; y < d.y1; y++) for (let x = d.x0; x < d.x1; x++) b.set(x, y, s.door === 'shut' ? PAL.G2 : bayer(x, y) < 0.3 ? PAL.G5 : PAL.G4);
  // its light on the floor line
  if (s.door !== 'shut') for (let y = d.y1; y < d.y1 + 8; y++) for (let x = d.x0 - 4; x < d.x1 + 4; x++) if (bayer(x, y) < 0.4 - (y - d.y1) * 0.05) b.set(x, y, stepColor(b.get(x, y), 1));
  // the table's edge across the bottom
  rect(0, 170, 480, 33, b.ink(PAL.D1)); rect(0, 170, 480, 1, b.ink(PAL.D3));
  glass(b, T.glass);
  if (s.call !== false) {
    // the call, dimmed (the screen at rest): four faint tile outlines
    for (let i = 0; i < 4; i++) {
      const tx = T.glass.x + 16 + (i % 2) * 114, ty = T.glass.y + 14 + Math.floor(i / 2) * 62;
      for (let k = 0; k < 104; k += 2) { b.set(tx + k, ty, PAL.N2); b.set(tx + k, ty + 54, PAL.N2); }
      for (let k = 0; k < 54; k += 2) { b.set(tx, ty + k, PAL.N2); b.set(tx + 104, ty + k, PAL.N2); }
    }
  }
  if (s.alyi !== null) {
    const img = alyiReflectionLook({mouth: s.alyi?.mouth ?? 'rest', eyes: 'open', t: f}, s.alyi?.look ?? 'door');
    reflect(b, img, T.glass.x + T.alyi.x, T.glass.y + T.alyi.y, T.glass);
  }
  sheen(b, T.glass);
  drawNelehMedium(b, 372, 30, {...NELEH_MEDIUM_DEFAULT, head: '34', arm: 'marker', ...s.neleh}, {orbit: f, table: (bb) => { rect(0, 170, 480, 33, bb.ink(PAL.D1)); rect(0, 170, 480, 1, bb.ink(PAL.D3)); }});
  void hash;
};
