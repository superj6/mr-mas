// MR. MAS — Ep2 v1 · act3: SC 17's drawings, THE NDA ACROSS THE BRIDGE (MAY 17 -> MAY 20, 2024; NopeAI's front doors,
// the Bay Bridge; the S3; act-out 2). The shots pass, 2026-10-09. The places and props are the art pass's (art/sets/
// bridge.ts: the doors up the hill, the deck in four lights, the cars, the DRIVER, the pen on its chain, the voice
// menu; art/creatures.ts: the blimp, the storm cloud with a blank letterhead), the cast its (art/cast/forecaster,
// art/cast/mas2); this file stages the shots:
//   doors(b, f, st)          [W] 17.01: the receipt pouring out of the doors; the Forecaster walking up from the street
//   run(b, f, st)            [W] 17.02: the quick run: three parallax planes; the receipt across the lanes in the near
//                            plane, its lines legible (each parked in view for its read), cars rolling over it, slowing,
//                            stopping; the coupon at its very end
//   deck(b, f, st)           [W] across the lanes: the art's deck (copied as deckBase) with the Forecaster on the far
//                            lane and Mas small on the near one (his phone, his umbrella), the pen on its chain at the
//                            far lane, the blimp, the cloud, the night's palette cycle, the afternoon's post over the
//                            sky, May 20's receipt trodden flat ('flat') and its ink running ('ink')
//   penLow(b, f, st)         [LOW] 17.04's head: the pen on its bank chain rising out of the receipt
//   foreMCU(b, f, st)        [MCU] the Forecaster on the far lane at evening (art/cast/forecaster bust): talking to the
//                            pen (it hangs in front of him on its chain), letting it go
//   driver(b, f, st)         [M] 17.05 / 17.16: the DRIVER in his window (art/sets/bridge driverWindow, copied: one
//                            continuous arm from his shoulder to his elbow on the sill, the hand over its edge), the
//                            window rolling down
//   scramble(b, f, st)       [ECU] 17.08 / 17.10 / 17.13: his phone in his hand on the bridge at dusk: the staff's
//                            screenshot of a clause (NON-DISPARAGEMENT), the grey LEGAL tile (call me), a second request
//                            for comment; the call; the draft typed, deleted, typed (grey bars, no word); Post untouched
//   masCall(b, f, st)        [MCU] 17.09 / 17.11: his face locked at dusk on the bridge, the phone at his ear (the call)
//                            or not (the still face), the cable and the city behind him
//   shoes(b, f, st)          [ECU] 17.11's head: his sneakers from above (laces, toe caps, midsoles) on the receipt,
//                            the paper still unrolling under them
//   fore2S(b, f, st)         [2S] 17.12: Mas (screen-left) and the Forecaster beside him, clipboard up
//   menu(b, f, st)           [POV] 17.19 / 17.20: the voice menu on his rain-beaded phone (the art's), his thumb on
//                            Pause; then his company's post beside it, two fragments
// What Mas knew, and whether the voice was meant to sound like anyone: nothing here tells us (W8).
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {bridgeDoors, bridgeDeck, drawCar, voiceMenu} from '../../art/sets/bridge';
import {makeBust3} from '../../art/cast/civic2';
import type {BustState, BustSpec3} from '../../art/cast/civic2';
import {SKIN, putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import type {DeckSt} from '../../art/sets/bridge';
import {forecasterBust, drawForecasterRoom} from '../../art/cast/forecaster';
import type {ForecasterRoomPose} from '../../art/cast/forecaster';
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Legs, Mas2Arm} from '../../art/cast/mas2';
import {drawEp2Post, requestPush} from '../../art/props/ui';
import {drawStormCloud, drawBlimp, drawReceiptLane} from '../../art/creatures';
import {drawProbUmbrella} from '../../art/cast/forecaster';
import {placeHand, drawHand, sleeve, POSES, skinDown} from '../../art/cast/hands2';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {RH, W, TR, glow, isSkin, putBustSoft, cupThumb, mirror, dimRoom, keyBalloon} from './common';

// ================================================================== the receipt (the exit agreement)
/** its print, as one run along the paper (the art's RECEIPT_LINES with the script's whole CLAUSE 9 line): the lines,
 *  separated by the thermal printer's dotted rules, ending on the dashed tear line and the coupon */
export const RECEIPT_RUN = ['NON-DISPARAGEMENT', 'IN PERPETUITY', 'CLAUSE 9: THIS RECEIPT DOES NOT EXIST.', '- - - - - - - -', 'SAVE 0% ON YOUR NEXT EXIT'];
const GAP = 24;
/** each item's face: the receipt's headline lines in the bold face, the long CLAUSE 9 line and the tear in the plain
 *  face (legible at 1080p, and short enough that two items share the frame while the camera parks between them) */
const bold = (s: string) => !s.startsWith('CLAUSE') && !s.startsWith('-');
const wOf = (s: string) => (bold(s) ? bpw(s) : pw(s));
/** the x of each item along the run, its width, and the run's length */
export const runLayout = () => { const xs: number[] = [], ws: number[] = []; let x = 0; for (const s of RECEIPT_RUN) { xs.push(x); ws.push(wOf(s)); x += wOf(s) + GAP; } return {xs, ws, len: x}; };
/** the receipt band (thermal paper, its edges, its print) across the frame at y, h tall, scrolled so that run-x `at`
 *  sits at frame x `atX`; the coupon boxed */
export const receiptBand = (b: Buf, y: number, h: number, at: number, atX: number, o: {tyres?: number[]; run?: number} = {}) => {
  const {xs, len} = runLayout();
  const off = atX - at;
  for (let yy = y; yy < y + h; yy++) for (let x = 0; x < W; x++) {
    const rx = x - off;
    if (rx < -400 || rx > len + 30) continue;
    b.set(x, yy, yy === y || yy === y + h - 1 ? PAL.P0 : (x + yy * 3) % 61 === 0 ? PAL.P1 : PAL.P2);
  }
  RECEIPT_RUN.forEach((s, i) => {
    const x = xs[i] + off, w = wOf(s);
    if (x > W || x + w < 0) return;
    const ty = y + Math.round((h - (bold(s) ? 14 : 7)) / 2);
    if (s.startsWith('SAVE')) { fill(b, x - 6, y + 4, w + 12, h - 8, PAL.P1); for (let i2 = x - 6; i2 < x + w + 6; i2 += 2) { b.set(i2, y + 4, PAL.N2); b.set(i2, y + h - 5, PAL.N2); } }
    if (bold(s)) bpt(b, s, x, ty, PAL.N1); else pt(b, s, x, ty, s.startsWith('-') ? PAL.G4 : PAL.N1);
    if (o.run) for (let r = 1; r <= o.run; r++) for (let i2 = 0; i2 < w; i2 += 3) if (hash(i2, i, 4) < 0.5) b.set(x + i2, ty + (bold(s) ? 14 : 7) + r * 2, PAL.G5);
  });
  for (const tx of o.tyres ?? []) for (let yy = y; yy < y + h; yy++) { b.set(tx, yy, PAL.G4); b.set(tx + 1, yy, PAL.G3); }
};

// ================================================================== 17.01: the doors
export const doors = (b: Buf, f: number, st: {pour: number; fx: number; legs: number | null; look?: boolean}) => {
  bridgeDoors(b, f, {pour: st.pour}, (bb) => {
    const p: Partial<ForecasterRoomPose> = st.legs === null ? {state: 'stand'} : {state: 'walk', legs: (['w0', 'w1', 'w2', 'w3'] as const)[st.legs & 3]};
    drawForecasterRoom(bb, st.fx, 190, p, {flip: true});
  });
};

// ================================================================== 17.02: the quick run
/** three parallax planes scrolled by `s` (the camera tracking along the bridge at the receipt's speed): the far city
 *  and the bay (s/8), the towers and cables (s/3), the lanes and the receipt in the near plane (s); the cars drive
 *  over the receipt at their own speed (`carV`), slowing to a stop */
export const run = (b: Buf, f: number, st: {s: number; at: number; carS: number; stopped: number}) => {
  // the evening sky and the far city (a slow scroll)
  vramp(b, 0, 0, W, 96, [PAL.U1, PAL.U3, PAL.U4, PAL.W4]);
  const fs = Math.floor(st.s / 8);
  for (let x = 0; x < W; x += 6) { const wx = x + fs; const h = 6 + Math.floor(hash(Math.floor(wx / 6), 1, 9) * 20); fill(b, x, 96 - h, 6, h, PAL.U1); if (hash(Math.floor(wx / 6), 2, 9) < 0.4) b.set(x + 2, 96 - h + 3, PAL.W5); }
  vramp(b, 0, 96, W, 14, [PAL.U2, PAL.N2]);
  // the towers and their cables (mid plane)
  const ms = Math.floor(st.s / 3);
  for (let k = -1; k < 4; k++) {
    const tx = ((k * 220 - ms) % 880 + 880) % 880 - 200;
    fill(b, tx, 4, 9, 110, PAL.G3); fill(b, tx + 2, 4, 5, 110, PAL.G4); fill(b, tx - 4, 30, 17, 4, PAL.G3);
    for (let x = tx; x < tx + 220; x++) { const y = Math.round(10 + Math.pow((x - tx - 110) / 110, 2) * 60); if (x >= 0 && x < W) b.set(x, y, PAL.G4); if ((x - tx) % 20 === 0) line(x, y, x, 112, b.ink(PAL.G2)); }
  }
  // the deck: the far rail, four lanes of evening traffic above the near lane where the receipt runs
  fill(b, 0, 108, W, 4, PAL.G4); fill(b, 0, 110, W, 1, PAL.G5);
  vramp(b, 0, 112, W, 91, [PAL.G1, PAL.G2]);
  const ls = st.s % 24;
  for (let l = 1; l < 4; l++) for (let x = -ls; x < W; x += 24) fill(b, x, 112 + l * 14, 10, 1, PAL.P1);
  // the receipt across the lanes in the near plane, its print legible
  const RY = 158, RH2 = 30;
  receiptBand(b, RY, RH2, st.at, 240);
  // the cars: the far lanes' traffic, and the near lanes' cars rolling over the receipt (their tyres on it), slowing
  for (let l = 0; l < 3; l++) for (let k = 0; k < 6; k++) { const x = ((k * 97 + l * 41 - Math.floor(st.carS * (1 + l * 0.15))) % 600 + 600) % 600 - 60; drawCar(b, x, 124 + l * 14, l * 5 + k, {driver: true, lights: true}); }
  // (the near lane's cars drive along the receipt's far edge, their tyres on the paper, never over the print)
  // (the review: an orange near-lane car stopped on top of an orange car in the lane behind it, reading as one car
  // drawn twice: the near lane's phase moved 20 px and its colours walked one step)
  for (let k = 0; k < 4; k++) { const x = ((k * 150 + 50 - Math.floor(st.carS * 1.3)) % 600 + 600) % 600 - 60; drawCar(b, x, RY + 3, k * 3 + 2, {driver: true, lights: true}); for (const wx of [x + 9, x + 35]) if (wx >= 0 && wx < W) { b.set(wx - 3, RY + 5, PAL.P0); b.set(wx + 3, RY + 5, PAL.P0); } }
  // the near rail in front, a blur of posts (they stop when the traffic does)
  fill(b, 0, 194, W, 9, PAL.G2); fill(b, 0, 194, W, 1, PAL.G4);
  for (let x = -(st.s % 18); x < W; x += 18) fill(b, x, 194, 3, 9, PAL.G3);
  void st.stopped; void f;
};

// ================================================================== across the lanes
export interface Across {
  time: DeckSt['time']; cycle?: number; receipt?: 'fresh' | 'flat' | 'run' | 'ink' | null; inkRun?: number; moving?: boolean; blimp?: DeckSt['blimp']; cloud?: {x: number; y: number} | null; flash?: boolean; umbrella?: boolean;
  fore?: {x: number; p: Partial<ForecasterRoomPose>; flip?: boolean} | null;
  /** the Forecaster crossing the lanes (between the cars), not on the far lane */
  foreLane?: {x: number; y: number; legs: number} | null;
  mas?: {x: number; arm: Mas2Arm; legs?: Mas2Legs; bow?: boolean; lit?: boolean; flip?: boolean} | null;
  pen?: {rise: number} | null;
  post?: {id: 'apology1' | 'apology2' | 'apology3' | 'apology4'; k: number; shake?: number} | null;
  honk?: number;
}
/** the pen on its bank chain at the far lane, rising out of the receipt beside the Forecaster (room scale) */
const penSmall = (b: Buf, x: number, rise: number) => {
  const top = Math.round(140 - rise * 46);
  for (let y = 140; y > top + 8; y -= 2) b.set(x + ((y >> 1) & 1), y, PAL.G5);
  fill(b, x - 1, top, 3, 8, PAL.N1); b.set(x, top - 1, PAL.G5); b.set(x, top + 8, PAL.G6);
};
// ------------------------------------------------------------------ the deck (art/sets/bridge bridgeDeck, copied)
// copied so May 20's receipt can lie between the lanes and the traffic: 'flat' (17.17) is the receipt trodden flat,
// grey with the wet, its print faint, the tyres' tracks along it, torn through in places; 'ink' (17.18) the same, its
// print running in the rain (each glyph's ink washed and streaking along the wet paper, `inkRun` px). The review: in
// 17.17 the trodden receipt was effectively invisible, and in 17.18 it came back a fresh, crisp strip.
type DeckRec = 'fresh' | 'flat' | 'run' | 'ink' | null;
const skyB = (b: Buf, t: DeckSt['time'], cycle: number, flash: boolean) => {
  if (t === 'night') vramp(b, 0, 0, 480, 90, [PAL.N0, PAL.N1, PAL.N2]);
  else if (t === 'afternoon') vramp(b, 0, 0, 480, 90, [PAL.C6, PAL.C7, PAL.P1]);
  else if (t === 'rain') vramp(b, 0, 0, 480, 90, flash ? [PAL.N6, PAL.N7, PAL.N8] : [PAL.N3, PAL.N4, PAL.G3]);
  else vramp(b, 0, 0, 480, 90, [PAL.U1, PAL.U3, PAL.U4, PAL.W4]);
  for (let x = 0; x < 480; x += 6) { const h = 6 + Math.floor(hash(x, 1, 9) * 18); fill(b, x, 90 - h, 6, h, t === 'afternoon' ? PAL.G5 : t === 'rain' ? PAL.G2 : PAL.U1); if (t === 'night' && hash(x, 2, 9) < 0.6) b.set(x + 2, 90 - h + 3, (Math.floor(x / 6) + cycle) % 4 === 0 ? PAL.W8 : PAL.W5); }
  vramp(b, 0, 90, 480, 20, t === 'night' ? [PAL.N1, PAL.N0] : t === 'afternoon' ? [PAL.C5, PAL.C4] : t === 'rain' ? [PAL.G2, PAL.N3] : [PAL.U2, PAL.N2]);
};
/** the receipt trodden flat along the lane (y0, 16 tall), grey with the wet; `run` > 0: its ink running */
const trodReceipt = (b: Buf, y0: number, run: number) => {
  const t = new Buf(480, 16, TR);
  drawReceiptLane(t, 0, 480, 0, 16, 37, {});
  const MAP: Record<number, number> = {[PAL.P2]: PAL.G4, [PAL.P1]: PAL.G3, [PAL.P0]: PAL.G3, [PAL.N2]: PAL.G2, [PAL.N1]: PAL.G2};
  const out = new Buf(480, 16, TR);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 480; x++) {
    const v = t.get(x, y); if (v === TR) continue;
    // torn through in places (the asphalt shows): ragged gaps along the length
    const gap = hash(x >> 3, 11, 3) < 0.07 && hash(x, y >> 1, 4) < 0.85;
    if (gap) continue;
    let c = MAP[v] ?? v;
    // its wrinkles: diagonal creases a rung up; the tyres' tracks along it a rung or two down
    if ((x + y * 2) % 41 === 0) c = stepColor(c, 1);
    if ((y === 3 || y === 4 || y === 12 || y === 13) && hash(x >> 2, y, 6) < 0.8) c = stepColor(c, -1);
    out.set(x, y, c);
  }
  if (run > 0) {
    // the ink running: each glyph pixel washed a rung lighter, its ink streaking along the paper and down with the water
    for (let y = 0; y < 16; y++) for (let x = 0; x < 480; x++) {
      if (t.get(x, y) !== PAL.N2 && t.get(x, y) !== PAL.N1) continue;
      if (out.get(x, y) === TR) continue;
      for (let i = 1; i <= run; i++) { const X = x + i, Y = y + Math.round(i * 0.6); if (Y < 16 && out.get(X, Y) !== TR && (i < run || hash(x, y, 9) < 0.5)) out.set(X, Y, i < run * 0.5 ? PAL.G2 : PAL.G3); }
      out.set(x, y, PAL.G3);
    }
  }
  for (let y = 0; y < 16; y++) for (let x = 0; x < 480; x++) { const v = out.get(x, y); if (v !== TR) b.set(x, y0 + y, v); }
};
const deckBase = (b: Buf, f: number, st: Omit<DeckSt, 'receipt'> & {receipt?: DeckRec; inkRun?: number}, cast: {far?: (b: Buf) => void; near?: (b: Buf) => void} = {}) => {
  const t = st.time ?? 'evening', cycle = st.cycle ?? 0;
  skyB(b, t, cycle, !!st.flash);
  if (st.umbrella) drawProbUmbrella(b, 430, 70);
  if (st.cloud) drawStormCloud(b, 170, 4, f, {rain: t === 'rain', flash: st.flash});
  if (st.blimp) drawBlimp(b, st.blimp.x ?? 330, st.blimp.y ?? 34, st.blimp.size, {lights: st.blimp.lights, sag: st.blimp.sag});
  fill(b, 60, 10, 8, 110, PAL.G3); fill(b, 62, 10, 4, 110, PAL.G4); fill(b, 56, 40, 16, 4, PAL.G3);
  for (let x = 0; x < 480; x++) { const y = Math.round(14 + Math.pow((x - 64) / 420, 2) * 80); b.set(x, y, PAL.G4); if (x % 24 === 0) { line(x, y, x, 118, b.ink(PAL.G2)); if (t === 'night') b.set(x, y, [PAL.W8, PAL.W6, PAL.W4, PAL.W6][(Math.floor(x / 24) + cycle) % 4]); } }
  fill(b, 0, 112, 480, 6, PAL.G3); fill(b, 0, 110, 480, 2, PAL.G5); for (let x = 0; x < 480; x += 8) fill(b, x, 104, 1, 6, PAL.G4);
  cast.far?.(b);
  vramp(b, 0, 118, 480, 64, t === 'night' ? [PAL.N1, PAL.N2] : t === 'rain' ? [PAL.N2, PAL.N3] : [PAL.G1, PAL.G2]);
  for (let l = 1; l < 5; l++) for (let x = (l * 7 + (st.moving ? f * 3 : 0)) % 24; x < 480; x += 24) fill(b, x, 118 + l * 13, 10, 1, PAL.P1);
  if (st.receipt === 'fresh' || st.receipt === 'run') drawReceiptLane(b, 0, 480, 140, 16, (st.scroll ?? 0) + f, {run: st.receipt === 'run' ? 1 + (Math.floor(f / 8) % 3) : 0});
  if (st.receipt === 'flat' || st.receipt === 'ink') trodReceipt(b, 140, st.receipt === 'ink' ? Math.max(1, Math.round(st.inkRun ?? 3)) : 0);
  for (let l = 0; l < 5; l++) for (let k = 0; k < 7; k++) {
    const x = ((k * 76 + l * 31) % 520) - 30 + (st.moving ? (f * (2 + l % 2)) % 76 : 0);
    drawCar(b, x, 130 + l * 13, l * 7 + k, {dim: t === 'night' ? 2 : t === 'rain' ? 1 : 0, lights: t === 'night' || t === 'rain', driver: true});
  }
  fill(b, 0, 182, 480, 21, PAL.G2); fill(b, 0, 182, 480, 1, PAL.G4);
  cast.near?.(b);
  fill(b, 0, 196, 480, 2, PAL.G4); for (let x = 0; x < 480; x += 10) fill(b, x, 186, 2, 10, PAL.G3);
  if (t === 'rain') for (let k = 0; k < 220; k++) { const rx = Math.floor(hash(k, 1, Math.floor(f / 2)) * 480), ry = Math.floor(hash(k, 2, Math.floor(f / 2)) * 200); b.set(rx, ry, PAL.G5); b.set(rx - 1, ry + 1, PAL.G4); b.set(rx - 2, ry + 2, PAL.G3); }
  if (t === 'night') for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.12) b.set(x, y, stepColor(b.get(x, y), -1));
};
export const deck = (b: Buf, f: number, st: Across) => {
  deckBase(b, f, {time: st.time, cycle: st.cycle, receipt: st.receipt ?? 'fresh', inkRun: st.inkRun, moving: st.moving, blimp: st.blimp, cloud: false, flash: st.flash, umbrella: st.umbrella}, {
    far: (bb) => { if (st.fore) drawForecasterRoom(bb, st.fore.x, 112, st.fore.p, {flip: st.fore.flip ?? true}); if (st.pen) penSmall(bb, (st.fore?.x ?? 380) - 20, st.pen.rise); },
    near: (bb) => {
      if (st.foreLane) drawForecasterRoom(bb, st.foreLane.x, st.foreLane.y, {state: 'walk', legs: (['w0', 'w1', 'w2', 'w3'] as const)[st.foreLane.legs & 3]}, {flip: true});
      if (st.mas) {
        drawMasStand2(bb, st.mas.x, 200, {arm: st.mas.arm, legs: st.mas.legs ?? 'stand', bow: st.mas.bow, light: st.time === 'night' ? 'sil' : 'dusk'}, {f, flip: st.mas.flip});
        if (st.mas.lit) { const px = st.mas.x + (st.mas.flip ? -1 : 1) * 1; glow(bb, px + 2, 152, 10, 8, 1); }
      }
    },
  });
  // the storm cloud rolling out of the city with its blank letterhead (over the sky only: the bridge's cables stay in
  // front of it), raining letterhead in the rain
  if (st.cloud) { const t = new Buf(W, 270, TR); drawStormCloud(t, st.cloud.x, st.cloud.y, f, {rain: st.time === 'rain', flash: st.flash}); for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { let v = t.c[y * W + x]; if (v === TR) continue; const cur = b.get(x, y); if (lightness(v) < 0.45) v = stepColor(v, -2); if (y < 104 || lightness(v) > 0.6) { if (y >= 90 && lightness(cur) < 0.12 && lightness(v) < 0.6) continue; b.set(x, y, v); } } }
  if (st.honk !== undefined && st.honk >= 0 && st.honk < 8) { const hx = (st.mas?.x ?? 100) + 60, hy = 160; for (let q = 0; q < 3; q++) { b.set(hx + 4 + q * 3, hy - 4 + q, PAL.P2); b.set(hx + 5 + q * 3, hy - 4 + q, PAL.P2); b.set(hx + 4 + q * 3, hy + 4 - q, PAL.P2); } }
  if (st.post) { const w = 236; drawEp2Post(b, 240 - w / 2 + (st.post.shake ?? 0) * 2, 12, st.post.id, {size: 'popup', w, k: st.post.k}); }
};

// ================================================================== the pen, low
export const penLow = (b: Buf, f: number, st: {rise: number; fore?: boolean}) => {
  // a low angle at the receipt: the paper filling the frame's foot (its print running away from us), the stalled cars'
  // wheels beyond it, the evening sky; the pen on its bank chain rising out of the paper toward the Forecaster, whose
  // legs and clipboard stand at the frame's right
  vramp(b, 0, 0, W, RH, [PAL.U2, PAL.U3, PAL.U4]);
  for (let x = 0; x < W; x += 6) { const h = 4 + Math.floor(hash(x, 1, 9) * 12); fill(b, x, 70 - h, 6, h, PAL.U1); }
  fill(b, 0, 70, W, 60, PAL.G2);
  for (let k = 0; k < 5; k++) drawCar(b, k * 110 - 40, 116, k * 2 + 3, {driver: true, lights: true});
  // the receipt from low: a wide trapezoid toward us, its lines growing nearer
  for (let y = 120; y < RH; y++) { const t = (y - 120) / 83, half = 120 + t * 260; for (let x = Math.max(0, Math.round(220 - half)); x < Math.min(W, Math.round(220 + half)); x++) b.set(x, y, (y + x * 0) % 9 === 0 ? PAL.P1 : PAL.P2); }
  const lines = ['NON-DISPARAGEMENT', 'IN PERPETUITY'];
  lines.forEach((s, i) => { const y = 132 + i * 30; if (i === 1) bpt(b, s, 220 - Math.round(bpw(s) / 2), y, PAL.N1); else pt(b, s, 220 - Math.round(pw(s) / 2), y, PAL.N2); });
  // the pen on its chain: the chain's links from the paper up, the pen (a bank pen: a black barrel, a steel collar)
  const top = Math.round(176 - st.rise * 128);
  for (let y = 178; y > top + 34; y -= 3) { b.set(250 + ((y >> 1) & 1), y, PAL.G6); b.set(251 + ((y >> 1) & 1), y + 1, PAL.G3); }
  fill(b, 243, top, 14, 34, PAL.N1); fill(b, 243, top, 14, 2, PAL.G4); fill(b, 243, top, 2, 34, PAL.G2); fill(b, 247, top + 34, 6, 6, PAL.G6); fill(b, 249, top + 40, 2, 3, PAL.G4);
  fill(b, 243, top + 8, 14, 3, PAL.G6);
  void f;
};

// ================================================================== the Forecaster, close
let FORE_BG: Buf | null = null;
/** behind him: the far lane at evening, out of focus: the sky, the cable's line, the city across the bay */
const foreBack = (): Buf => {
  if (FORE_BG) return FORE_BG;
  const b = new Buf(W, RH, PAL.U2);
  vramp(b, 0, 0, W, RH, [PAL.U1, PAL.U3, PAL.U4, PAL.W4]);
  for (let x = 0; x < W; x += 8) { const h = 10 + Math.floor(hash(x, 1, 7) * 26); for (let y = 150 - h; y < 150; y++) if (bayer(x, y) < 0.8) fill(b, x, y, 8, 1, PAL.U1); }
  vramp(b, 0, 150, W, 53, [PAL.U2, PAL.N2]);
  for (let x = 0; x < W; x++) { const y = Math.round(40 + x * 0.12); b.set(x, y, PAL.G4); b.set(x, y + 1, PAL.G3); if (x % 30 === 0) for (let yy = y; yy < 150; yy++) if (bayer(x, yy) < 0.6) b.set(x, yy, PAL.G2); }
  FORE_BG = b;
  return b;
};
/** his bust in the evening (art/cast/forecaster: kind, precise; the clipboard), keyed one step from the low sun
 *  (camera-right) */
const FORE = new Map<string, ReturnType<typeof forecasterBust>>();
const foreImg = (s: Parameters<typeof forecasterBust>[0]) => {
  const key = JSON.stringify(s); const hit = FORE.get(key); if (hit) return hit;
  const im = faceLightImg(forecasterBust(s), 1, {key: [1, -0.3]});
  FORE.set(key, im);
  return im;
};
/** [MCU] the Forecaster on the far lane, the pen hanging in front of him on its chain (st.pen 0 none .. 1 up at his
 *  chest), talking to it; his mouth from st.mouth */
export const foreMCU = (b: Buf, f: number, st: {mouth: Viseme; expr?: 'neutral' | 'smile' | 'focus'; pen?: number; let?: boolean}) => {
  b.c.set(foreBack().c.subarray(0, W * RH));
  putBustSoft(b, foreImg({mouth: st.mouth, expr: st.expr ?? 'focus', arm: 'clipboard'}), 230, 30, RH);
  const p = st.pen ?? 0;
  if (p > 0) {
    // the chain from the frame's foot up to the pen, hanging in front of him at chest height, a little to his left
    const top = Math.round(RH - p * 74), x = 196;
    for (let y = RH; y > top + 34; y -= 3) { b.set(x + ((y >> 1) & 1), y, PAL.G6); b.set(x + 1 + ((y >> 1) & 1), y + 1, PAL.G3); }
    fill(b, x - 6, top, 13, 32, PAL.N1); fill(b, x - 6, top, 13, 2, PAL.G4); fill(b, x - 6, top, 2, 32, PAL.G2); fill(b, x - 2, top + 32, 6, 5, PAL.G6); fill(b, x - 6, top + 8, 13, 3, PAL.G6);
  }
  void f;
};

// ================================================================== the DRIVER
// the DRIVER's own head (art/sets/bridge's, copied: an everyday man, nobody real), so his window can be redrawn with
// one arm (the review: his arm read as detached capsules, a bar on the sill with a gap to his torso, a second tube and
// a hand hanging at a right angle)
const driverSpec: BustSpec3 = {
  head: {yaw: 20, at: [57, 56], scale: 1.05, cranium: [21, 24, 23], cheekW: 18, jawW: 17, jawY: 19, chinY: 33, chinW: 8, chinZ: 12, cheekbone: 0.5, full: 1, brow: 2.2,
    nose: {tipY: 13.5, proj: 7, wing: 5, tip: 3.8}, mouthY: 23, eyeX: 8.5, neck: {r: 10.5, throat: true}, hair: {style: 'cap', thick: 2.6, line: -12},
    skin: SKIN.medium, hairRamp: [PAL.N0, PAL.F1, PAL.F2, PAL.F3, PAL.F4, PAL.F5], back: {skin: PAL.S3, hair: PAL.F4}},
  face: {eye: 'hooded', eyeW: 8, eyeH: 2, brow: 'heavy', browCol: PAL.B1, mouthW: 11, age: 2, stubble: true},
  torso: {kind: 'jacket', sy: 104},
  ramps: {skin: SKIN.medium, suit: [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W5], shirt: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2]},
  backRamp: {skin: PAL.S3, suit: PAL.R2},
};
const driverBust = makeBust3<BustState>(driverSpec);
const JACKET_SL: number[] = [PAL.R0, PAL.R0, PAL.R1, PAL.R2, PAL.R2];
/** [M] the side of his car fills the frame (the art's driverWindow, its arm redrawn): the red body round the window, the
 *  dark cabin, the driver leaning out: ONE ARM, a continuous sleeve from his near shoulder down through the open window
 *  to his elbow on the sill, the forearm along the sill's rubber, narrowing to the cuff, the hand over the sill's
 *  outer edge, resting (the wrist bent, the fingers down the door) */
const driverWin = (b: Buf, f: number, st: {mouth?: BustState['mouth']; expr?: BustState['expr']}) => {
  fill(b, 0, 0, 480, RH, PAL.R1); vramp(b, 0, 0, 480, 30, [PAL.U3, PAL.U2]);
  fill(b, 0, 28, 480, 4, PAL.R2);
  fill(b, 110, 36, 320, 142, PAL.N0); fill(b, 114, 40, 312, 134, PAL.N1); vramp(b, 114, 40, 312, 134, [PAL.N1, PAL.N2, PAL.N1]);
  fill(b, 270, 44, 4, 130, PAL.N0);
  putBustCut(b, driverBust({mouth: st.mouth ?? 'rest', expr: st.expr ?? 'neutral'}), 140, 60, RH);
  // the door below the window line (over his chest), the sill's rubber, the handle
  fill(b, 0, 174, 480, 29, PAL.R2); fill(b, 0, 174, 480, 3, PAL.N0); fill(b, 0, 177, 480, 2, PAL.R3); fill(b, 330, 188, 34, 4, PAL.G4);
  // the arm in his jacket's own tones (the fixes pass, 2026-10-10: the review read the forearm as a flat red bar laid
  // along the window, and the hand over the door bigger than his head): the upper arm from the shoulder's cap out over
  // the sill to the elbow on its outer edge, bent there, the forearm hanging down outside the door at an angle, a dark
  // edge round it against the door's red, a crease inside the bend; the hand resting on the door, scaled to his face
  const sh: [number, number] = [182, 168], el: [number, number] = [136, 173], wr: [number, number] = [126, 184];
  sleeve(b, sh, el, 10, 9, JACKET_SL, [-0.55, -0.83], {fold: false});
  fill(b, 60, 174, 160, 3, PAL.N0); fill(b, 60, 177, 160, 2, PAL.R3);
  // the forearm outside the door: its silhouette a pixel wider in the dark first, so it parts from the door's red
  sleeve(b, [el[0] - 1, el[1] + 1], [wr[0], wr[1] + 1], 9.5, 7.5, [PAL.N0, PAL.N0, PAL.N0, PAL.N0], [-0.55, -0.83], {fold: false});
  sleeve(b, el, wr, 8.5, 6.5, JACKET_SL, [-0.55, -0.83], {fold: false});
  // the elbow over the sill's edge: its point lit, the crease inside the bend
  b.set(el[0] - 6, el[1] + 1, PAL.R3); b.set(el[0] - 6, el[1] + 2, PAL.R3);
  for (let i = 0; i < 6; i++) b.set(el[0] + 3 + Math.floor(i / 2), el[1] + 4 + i, PAL.R0);
  // (no cuff on the hand: the sleeve ends at the wrist, never up the hand's line)
  const h = placeHand({...POSES.open([-0.25, 0.95, 0.1], [-0.2, -0.25, 0.95], 'R'), cuff: 0}, {s: 2.3, at: [wr[0] - 1, wr[1] + 2], anchor: 'wrist', light: 'lobby'});
  drawHand(b, h.hand, h.x, h.y);
  void f;
};
export const driver = (b: Buf, f: number, st: {mouth: Viseme; expr?: 'neutral' | 'worry'; glass?: number; honkHand?: boolean}) => {
  driverWin(b, f, {mouth: st.mouth, expr: st.expr});
  // the window glass rolling down (it slides into the door in held steps: 1 = up .. 0 = down)
  const g = st.glass ?? 0;
  if (g > 0) { const h = Math.round(134 * g); for (let y = 40 + 134 - h; y < 174; y++) for (let x = 114; x < 426; x++) if (bayer(x, y) < 0.35) b.set(x, y, stepColor(b.get(x, y), 1)); fill(b, 114, 40 + 134 - h, 312, 2, PAL.G5); }
  void st.honkHand;
};

// ================================================================== his phone on the bridge
let DUSK_BG: Buf | null = null;
/** behind his phone: the bridge at dusk out of focus (the face shots' backdrop, a rung down) */
const duskBack = (): Buf => {
  if (DUSK_BG) return DUSK_BG;
  const b = new Buf(W, RH, PAL.N0);
  const t = faceBack();
  for (let i = 0; i < W * RH; i++) b.c[i] = stepColor(t.c[i], -1);
  DUSK_BG = b;
  return b;
};
export const PB = {x: 166, y: 6, w: 150, h: 300};
const CUFF = [PAL.N0, PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.U4];
const SLV = [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.U4];
/** the scramble's screens (a stack of things arriving): st.step 0..3 (the screenshot, LEGAL, the request), 'call'
 *  (the call to LEGAL ringing / live), 'draft' (the composer: grey bars typed to st.bars, the Post button untouched),
 *  st.k frames since the latest arrival (it drops in two held steps) */
export const scrambleScreen = (scr: Buf, st: {mode: 'stack' | 'call' | 'draft'; step?: number; k?: number; secs?: number; bars?: number; f?: number}) => {
  fill(scr, 0, 0, scr.w, scr.h, PAL.N2);
  tiny(scr, '7:58', 8, 4, PAL.N8);
  if (st.mode === 'stack') {
    const n = st.step ?? 0, drop = (i: number) => (i === n && (st.k ?? 9) < 3 ? -6 : 0);
    if (n >= 1) {
      // the staff's screenshot: a photo of the receipt's line, highlighted
      const y = 18 + drop(1);
      fill(scr, 6, y, scr.w - 12, 50, PAL.N3); tiny(scr, 'STAFF · SCREENSHOT', 10, y + 3, PAL.N8);
      fill(scr, 10, y + 12, scr.w - 20, 34, PAL.P2); fill(scr, 12, y + 22, pw('NON-DISPARAGEMENT') + 6, 12, PAL.W7);
      pt(scr, 'NON-DISPARAGEMENT', 15, y + 25, PAL.N1); fill(scr, 12, y + 38, 80, 2, PAL.G5);
    }
    if (n >= 2) {
      // the grey LEGAL tile: a grey icon, never named, never a face
      const y = 74 + drop(2);
      fill(scr, 6, y, scr.w - 12, 30, PAL.N3); fill(scr, 6, y, scr.w - 12, 1, PAL.N5);
      ellipse(22, y + 15, 9, 9, (x, yy) => scr.set(x, yy, PAL.G4)); ellipse(22, y + 12, 3, 3, (x, yy) => scr.set(x, yy, PAL.G6)); fill(scr, 17, y + 17, 11, 4, PAL.G6);
      pt(scr, 'LEGAL', 38, y + 5, PAL.P1); pt(scr, 'call me', 38, y + 16, PAL.N8);
    }
    if (n >= 3) requestPush(scr, 6, 110 + drop(3), scr.w - 12);
    return;
  }
  if (st.mode === 'call') {
    ellipse(scr.w / 2, 60, 22, 22, (x, y) => scr.set(x, y, PAL.G4)); ellipse(scr.w / 2, 54, 8, 8, (x, y) => scr.set(x, y, PAL.G6)); fill(scr, scr.w / 2 - 12, 64, 24, 8, PAL.G6);
    pt(scr, 'LEGAL', Math.round(scr.w / 2 - pw('LEGAL') / 2), 90, PAL.P2);
    const s = st.secs === undefined ? 'calling...' : `0:${String(st.secs).padStart(2, '0')}`;
    pt(scr, s, Math.round(scr.w / 2 - pw(s) / 2), 104, PAL.N8);
    ellipse(scr.w / 2, 170, 13, 13, (x, y) => scr.set(x, y, PAL.R1));
    return;
  }
  // the draft: the composer, grey bars (no word), the Post button (lit when there is anything to post), the keyboard
  fill(scr, 0, 14, scr.w, 18, PAL.N1); pt(scr, 'new post', Math.round(scr.w / 2 - pw('new post') / 2), 19, PAL.P1);
  fill(scr, scr.w - 40, 16, 34, 14, (st.bars ?? 0) > 0 ? PAL.C3 : PAL.N3); pt(scr, 'Post', scr.w - 34, 19, PAL.P2);
  fill(scr, 4, 36, scr.w - 8, 90, PAL.N3);
  let left = st.bars ?? 0;
  for (let r = 0; r < 6 && left > 0; r++) { const w = Math.min(left, scr.w - 24); fill(scr, 10, 44 + r * 12, w, 4, PAL.N6); left -= w; }
  if (Math.floor((st.f ?? 0) / 8) % 2 === 0) { const r = Math.max(0, Math.ceil((st.bars ?? 0) / (scr.w - 24)) - 1), xw = (st.bars ?? 0) - r * (scr.w - 24); fill(scr, 11 + Math.max(0, xw), 42 + r * 12, 1, 8, PAL.C6); }
  fill(scr, 0, 150, scr.w, scr.h - 150, PAL.N2);
  ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].forEach((row, r) => { for (let q = 0; q < row.length; q++) { const kx = 6 + q * 14 + r * 7, ky = 156 + r * 22; fill(scr, kx, ky, 12, 18, PAL.N4); fill(scr, kx, ky + 17, 12, 1, PAL.N1); } });
};
/** the phone in his hand on the bridge (common cupThumb), its screen `paint`; the thumb on a frame point */
export const phoneBridge = (b: Buf, f: number, paint: (scr: Buf) => void, tip: [number, number], o: {bg?: (b: Buf) => void; rain?: boolean} = {}) => {
  if (o.bg) o.bg(b); else b.c.set(duskBack().c.subarray(0, W * RH));
  const P = PB, scr = new Buf(P.w, P.h, PAL.N0);
  paint(scr);
  if (o.rain) for (let k = 0; k < 40; k++) { const x = Math.floor(hash(k, 1, 3) * P.w), y = Math.floor(hash(k, 2, 3) * 190); scr.set(x, y, PAL.C8); scr.set(x, y + 1, PAL.C5); }
  glow(b, P.x + P.w / 2, 90, 200, 140, 1, (x, y) => x >= P.x - 6 && x < P.x + P.w + 6 && y < P.y + P.h);
  return cupThumb(b, P, tip, {cuffRamp: CUFF, sleeveRamp: SLV, sleeveTo: [560, 330], widthCm: 7.4, skinMap: (c) => stepColor(c, -1), drawPhone: (bb) => {
    fill(bb, P.x - 6, P.y - 6, P.w + 12, P.h + 12, PAL.N0); fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.G1); fill(bb, P.x - 5, P.y - 5, 1, P.h + 10, PAL.G3);
    for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) { const Y = P.y + y; if (Y >= 0 && Y < RH) bb.set(P.x + x, Y, scr.get(x, y)); }
  }});
};

// ================================================================== his face on the bridge
let FACE_BG: Buf | null = null;
const faceBack = (): Buf => {
  if (FACE_BG) return FACE_BG;
  const t = new Buf(W, 270, PAL.N0);
  bridgeDeck(t, 0, {time: 'evening', receipt: 'fresh'});
  // the deck behind him out of focus: reframed on the far lane and the city, a rung down
  const b = new Buf(W, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(t.get(Math.min(479, Math.round(x * 0.8 + 40)), Math.min(202, Math.round(y * 0.7 + 30))), -2));
  FACE_BG = b;
  return b;
};
const MASD = new Map<string, ReturnType<typeof masPortrait>>();
/** his approved portrait at dusk on the bridge: the warm rig, the low sun keyed a step from camera-right, the dusk
 *  violet on his rim */
export const masDuskImg = (s: Partial<MasPortraitState>) => {
  const key = JSON.stringify(s); const hit = MASD.get(key); if (hit) return hit;
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...s});
  const RIM: Record<number, number> = {[PAL.W5]: PAL.U4, [PAL.W6]: PAL.U5, [PAL.W8]: PAL.W7};
  const c = im.c.slice(); for (let i = 0; i < c.length; i++) { const v = c[i]; if (v >= 0 && RIM[v] !== undefined) c[i] = RIM[v]; }
  const out = faceLightImg({...im, c}, 1, {key: [1, -0.3]});
  MASD.set(key, out);
  return out;
};
/** [MCU] his face locked at dusk (portrait facing camera-left, toward the far lane); `call`: the phone at his ear, his
 *  hand round it, the forearm down out of frame */
export const masCall = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']; call?: boolean; look?: -1 | 0 | 1}) => {
  b.c.set(faceBack().c.subarray(0, W * RH));
  const X = 150, Y = 26;
  putBustSoft(b, masDuskImg({mouth: st.mouth ?? 'rest', look: st.look ?? -1}), X, Y, RH);
  if (st.call) {
    // the phone pressed to his ear (the portrait's visible ear is at its right, about (78, 52) local): the slab's
    // edge against his cheek, his hand behind it (fingers along its back, the thumb on its near edge), the sleeve down
    const ex = X + 80, ey = Y + 50;
    fill(b, ex - 3, ey - 18, 10, 40, PAL.N0); fill(b, ex - 2, ey - 17, 2, 38, PAL.G3);
    const h = placeHand(POSES.grip([0.1, -1, 0.1], [0.95, 0, 0.3], 'L', 0.55), {s: 2.6, at: [ex + 4, ey + 6], anchor: 'middle', light: 'lobby', skinMap: skinDown(1), cuffRamp: CUFF});
    sleeve(b, h.cuffEnd, [ex + 30, RH + 40], 9, 13, SLV);
    drawHand(b, h.hand, h.x, h.y);
  }
  void f;
};
/** [ECU] his sneakers on the receipt from above, the paper still unrolling under them (the review: two navy blocks with
 *  hatched grey ovals, and a receipt that didn't read as moving): each sneaker drawn from above, the toe toward us: the
 *  jeans' hem over the ankle, the collar, the tongue and its laces crossing down to the vamp between two rows of
 *  eyelets, the navy canvas upper, the cream rubber toe cap with its seam, the white midsole's edge round it all, its
 *  shadow on the paper; the receipt's print sliding along under them (6 px a frame), its feed lines and the thermal
 *  printer's dotted rules streaming along with it, the paper's edge lifting a pixel where it curls */
const sneaker = (b: Buf, x: number, y: number, flip: boolean) => {
  // the sole's outline (heel narrow at the top, the ball widest, the toe round at the bottom): half-width by row
  const H = 104, half = (j: number) => { const t = j / H; return t < 0.12 ? 18 + t * 40 : t < 0.7 ? 23 + Math.sin(((t - 0.12) / 0.58) * Math.PI * 0.5) * 7 : 30 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.7) / 0.3, 2))); };
  const cx = x + 32, sk = flip ? 2 : -2;
  // the shadow on the paper (down and to the right)
  for (let j = 4; j < H + 4; j++) { const w = half(j - 4); for (let i = Math.round(-w); i <= w; i++) { const X = cx + i + 5, Y = y + j + 2; if (Y >= 0 && Y < RH) b.set(X, Y, stepColor(b.get(X, Y), -2)); } }
  for (let j = 0; j < H; j++) {
    const w = half(j), off = Math.round((j / H) * sk);
    for (let i = Math.round(-w); i <= w; i++) {
      const X = cx + i + off, Y = y + j; if (Y < 0 || Y >= RH) continue;
      const e = w - Math.abs(i), t = j / H;
      let c: number;
      if (e < 2.5) c = e < 1 ? PAL.G4 : PAL.P2; // the midsole's white edge, its outer line
      else if (t > 0.74) c = t > 0.76 && Math.abs((j - 0.76 * H) - 0) < 1 ? PAL.P0 : i < -w * 0.3 ? PAL.P2 : PAL.P1; // the toe cap, its seam
      else if (Math.abs(i) < 9 && t > 0.14 && t < 0.72) c = PAL.N5; // the tongue
      else c = i < -w * 0.4 ? PAL.N4 : i > w * 0.5 ? PAL.N2 : PAL.N3; // the canvas upper, lit from the left
      b.set(X, Y, c);
    }
  }
  // the laces: five crossings down the tongue, the eyelets either side
  for (let q = 0; q < 5; q++) {
    const yy = y + 22 + q * 11, off = Math.round(((yy - y) / H) * sk);
    for (let i = -8; i <= 8; i++) { b.set(cx + i + off, yy + Math.round(i * 0.35), PAL.P2); b.set(cx + i + off, yy - Math.round(i * 0.35) + 4, i === 0 ? PAL.P2 : PAL.P1); }
    for (const sd of [-1, 1]) { b.set(cx + sd * 11 + off, yy + 2, PAL.N0); b.set(cx + sd * 11 + off, yy + 1, PAL.G4); }
  }
  // the collar at the top and the jeans' hem over the ankle (denim, its stitched turn-up); the leg rising out of frame
  // toward us, widening a little
  for (let yy = 0; yy < y + 4; yy++) { const w = 20 + Math.round((y - yy) / 14), l = cx - w, r = cx + w; fill(b, l, yy, r - l, 1, PAL.F2); fill(b, l, yy, 4, 1, PAL.F3); fill(b, r - 4, yy, 4, 1, PAL.F1); if ((yy * 7) % 23 === 0) b.set(cx - 4 + (yy % 9), yy, PAL.F3); }
  fill(b, cx - 21, y, 42, 4, PAL.F3); for (let i = -19; i < 20; i += 3) b.set(cx + i, y + 1, PAL.F4);
  fill(b, cx - 16, y + 4, 32, 3, PAL.N1);
};
export const shoes = (b: Buf, f: number, st: {k: number}) => {
  vramp(b, 0, 0, W, 60, [PAL.G1, PAL.G2]);
  const run = 300 + st.k * 6;
  receiptBand(b, 60, 143, run, 240);
  // the feed: short streaks along the paper (its fibres and the printer's dotted rules) sliding up with it
  for (let q = 0; q < 26; q++) { const y = 64 + Math.floor(hash(q, 2, 8) * 136), x = ((Math.floor(hash(q, 1, 8) * W) - st.k * 6) % W + W) % W; for (let i = 0; i < 7; i++) if (y < RH) b.set(x + i, y, PAL.P1); }
  // the paper's near edge lifting where it curls off the roll (a pixel of shadow, a bright lip)
  fill(b, 0, 60, W, 1, PAL.W9); fill(b, 0, 61, W, 1, PAL.P0);
  sneaker(b, 120, 74, false);
  sneaker(b, 250, 92, true);
  void f;
};
/** [2S] 17.12: Mas at the left (his portrait facing right, still) and the Forecaster beside him at the right, the
 *  clipboard up; the bridge soft behind them */
export const fore2S = (b: Buf, f: number, st: {mouth: Viseme; expr?: 'neutral' | 'smile' | 'focus'}) => {
  b.c.set(faceBack().c.subarray(0, W * RH));
  putBustSoft(b, mirror(masDuskImg({mouth: 'rest', look: -1})), 40, 30, RH);
  putBustSoft(b, foreImg({mouth: st.mouth, expr: st.expr ?? 'smile', arm: 'clipboard'}), 272, 34, RH);
  void f;
};

// ================================================================== May 20: the voice menu and the company's post
export const menu = (b: Buf, f: number, st: {paused: boolean; thumb: boolean; post?: {k1: number; k2: number} | null}) => {
  voiceMenu(b, f, {paused: st.paused, thumb: st.thumb});
  if (st.post) {
    dimRoom(b, 1);
    // beside it: his company's post in its own UI, two fragments, the second a beat after the first
    if (st.post.k1 >= 0) drawEp2Post(b, 196, 30, 'pause1', {size: 'popup', w: 270, k: st.post.k1});
    if (st.post.k2 >= 0) drawEp2Post(b, 196, 104, 'pause2', {size: 'popup', w: 270, k: st.post.k2});
  }
};
void rect; void line; void poly; void clamp; void lightness; void pwrap; void tinyWidth; void TR; void isSkin; void keyBalloon;
