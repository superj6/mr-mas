// MR. MAS — Ep2 v1 art: SET-16, THE BAY BRIDGE (sc 17), and its props: NopeAI's front doors at the top of the hill with
// the exit agreement pouring out like a pharmacy receipt; five lanes of traffic stalled on it; the pedestrian lanes on
// both sides; three parallax planes for the quick run down the hill; the night (one held wide, the bridge's lights
// cycling once: a palette cycle, never a strobe); the next afternoon; May 20 in rain under the storm cloud with a blank
// letterhead; the `her` blimp sagging. Plus the DRIVER (§2.2) in his car window, the pen on a bank chain, the scramble on
// Mas's phone, and the voice menu where his thumb finds Pause.
//   bridgeDoors(b, f, st)    [W] 17.01: the cathedral's front doors at the top of the hill, the receipt pouring out and
//                            down the steps (st.pour 0..1); the Forecaster arriving from the street (the cast)
//   receiptRun(b, f, st)     [W] 17.02: one quick run, three parallax planes (st.scroll: whole px), the receipt running
//                            down the hill and across all five lanes, its lines legible under the tyres
//   bridgeDeck(b, f, st)     [W] mid-span across the lanes (Mas small in the foreground: the cast's `near`): st.time
//                            'evening' | 'night' (st.cycle 0..3: the lights' one palette cycle) | 'afternoon' | 'rain'
//                            (May 20: traffic moving, the receipt trodden flat, the ink running), st.blimp {size, lights,
//                            sag}, st.cloud, st.umbrella (the far-shore egg)
//   drawCar(b, x, y, seed, o)  a sedan side-on (room scale), its colour from the seed, o.window (rolled down), o.driver
//   driverWindow(b, f, st)   [M] 17.05 / 17.16: the DRIVER leaning out of his window, hand on the horn (lip-sync: st.mouth)
//   penChain(b, f, st)       [LOW] 17.04: the pen on a bank chain rising out of the receipt and offering itself; st.back
//   scramblePhone(b, f, st)  [ECU] 17.08-17.10: screenshots of a clause; the grey LEGAL tile (an icon, never named);
//                            a second request for comment; the outgoing call; a draft as grey bars (no legible word)
//   voiceMenu(b, f, st)      [POV] 17.19: his rain-beaded phone: five live waveforms; his thumb on Pause; VOICE 5 [PAUSED]
//                            greyed with its Hey. greyed under it (st.paused)
import {Buf, rect, line, ellipse, bayer, hash, clamp, poly} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness} from '../../../../../shared/pixel/palette';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp, hramp, RH, TR, dith, grip, HANDSKIN, capsule} from '../kit';
import {drawReceiptStrip, drawReceiptLane, drawBlimp, drawStormCloud} from '../creatures';
import {drawProbUmbrella} from '../cast/forecaster';
import {makeBust3, BustState, BustSpec3} from '../cast/civic2';
import {SKIN, HAIR} from '../../../../../shared/pixel/cast/civic-kit';
import {putBustCut} from '../../../../../shared/pixel/cast/civic-kit';
import {P} from '../../../../../shared/pixel/figure';
import {drawMasStand2} from '../cast/mas2';
import {drawForecasterRoom} from '../cast/forecaster';
import {placeHand, drawHand, sleeve, holdPhone, POSES, skinDown} from '../cast/hands2';
import type {ArtAsset} from '../asset';

// ------------------------------------------------------------------ cars
const CAR_COLS = [[PAL.R1, PAL.R2, PAL.R3], [PAL.F2, PAL.F3, PAL.F4], [PAL.G2, PAL.G4, PAL.G5], [PAL.L1, PAL.L2, PAL.L3], [PAL.W3, PAL.W4, PAL.W6], [PAL.N2, PAL.N4, PAL.N6], [PAL.U2, PAL.U3, PAL.U4]];
export const drawCar = (b: Buf, x: number, y: number, seed: number, o: {window?: boolean; driver?: boolean; flip?: boolean; dim?: number; lights?: boolean} = {}) => {
  const c = CAR_COLS[seed % CAR_COLS.length].map((v) => stepColor(v, -(o.dim ?? 0)));
  // body (44 x 14): a sedan, its cabin, two wheels
  for (let j = 0; j < 9; j++) for (let i = 0; i < 44; i++) { if ((i < 2 || i > 41) && j < 3) continue; b.set(x + i, y - 9 + j, j < 2 ? c[2] : j > 6 ? c[0] : c[1]); }
  for (let j = 0; j < 7; j++) { const inset = Math.round((6 - j) * 1.3); for (let i = 10 + inset; i < 34 - Math.round(inset * 0.6); i++) b.set(x + i, y - 16 + j, j < 1 ? c[2] : c[1]); }
  fill(b, x + 13, y - 14, 9, 5, o.window ? PAL.N0 : PAL.C3); fill(b, x + 23, y - 14, 8, 5, PAL.C3); b.set(x + 14, y - 14, PAL.C6);
  if (o.driver) { fill(b, x + 15, y - 14, 5, 5, PAL.S3); fill(b, x + 15, y - 14, 5, 2, PAL.N1); }
  for (const wx of [x + 9, x + 35]) { ellipse(wx, y, 4, 4, b.ink(PAL.N0)); ellipse(wx, y, 2, 2, b.ink(PAL.G3)); }
  if (o.lights) { b.set(x, y - 6, PAL.R3); b.set(x + 43, y - 6, PAL.W8); }
};

// ------------------------------------------------------------------ the doors at the top of the hill
export const bridgeDoors = (b: Buf, f: number, st: {pour?: number} = {}, cast?: (b: Buf) => void) => {
  // the evening sky, the cathedral's facade (its rack-pillar buttresses, the rose window, the glass doors) up the hill
  vramp(b, 0, 0, 480, 120, [PAL.U1, PAL.U2, PAL.U3, PAL.U4]);
  fill(b, 120, 20, 240, 120, PAL.G2); for (let y = 24; y < 140; y += 10) fill(b, 120, y, 240, 1, PAL.G1);
  for (const px of [130, 340]) { fill(b, px, 20, 14, 120, PAL.N2); for (let y = 26; y < 136; y += 5) b.set(px + 7, y, (y + Math.floor(f / 6)) % 3 ? PAL.C6 : PAL.L3); }
  ellipse(240, 44, 16, 16, b.ink(PAL.G3)); ellipse(240, 44, 13, 13, b.ink(PAL.C4)); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; line(240, 44, 240 + Math.round(Math.cos(a) * 12), 44 + Math.round(Math.sin(a) * 12), b.ink(PAL.G2)); }
  fill(b, 196, 76, 88, 64, PAL.N1); fill(b, 200, 80, 38, 60, PAL.C2); fill(b, 242, 80, 38, 60, PAL.C2); fill(b, 238, 80, 4, 60, PAL.W4); tiny(b, 'NOPE AI', 222, 70, PAL.C7);
  // the steps down the hill and the street
  for (let k = 0; k < 6; k++) fill(b, 170 - k * 8, 140 + k * 6, 140 + k * 16, 6, k % 2 ? PAL.G3 : PAL.G4);
  vramp(b, 0, 176, 480, 27, [PAL.G2, PAL.G1]);
  // the receipt pouring out of the doors, down the steps toward us, its lines legible
  const pour = clamp(st.pour ?? 1, 0, 1), len = Math.round(pour * 120);
  drawReceiptStrip(b, 226, 110, 28, Math.min(len, 60), f * 2);
  if (len > 60) for (let k = 0; k < len - 60; k++) { const y = 170 + Math.floor(k / 4), x = 226 + Math.round(Math.sin(k / 9) * 6); fill(b, x, y, 30 + Math.floor(k / 8), 1, k % 7 === 0 ? PAL.G5 : PAL.P2); }
  cast?.(b);
};

// ------------------------------------------------------------------ the deck
export interface DeckSt { time?: 'evening' | 'night' | 'afternoon' | 'rain'; cycle?: number; blimp?: {size: 1 | 2 | 3 | 4; lights?: number; sag?: number; x?: number; y?: number} | null; cloud?: boolean; umbrella?: boolean; receipt?: 'fresh' | 'flat' | 'run' | null; moving?: boolean; scroll?: number; flash?: boolean }
const sky = (b: Buf, t: DeckSt['time'], cycle: number, flash: boolean) => {
  if (t === 'night') vramp(b, 0, 0, 480, 90, [PAL.N0, PAL.N1, PAL.N2]);
  else if (t === 'afternoon') vramp(b, 0, 0, 480, 90, [PAL.C6, PAL.C7, PAL.P1]);
  else if (t === 'rain') vramp(b, 0, 0, 480, 90, flash ? [PAL.N6, PAL.N7, PAL.N8] : [PAL.N3, PAL.N4, PAL.G3]);
  else vramp(b, 0, 0, 480, 90, [PAL.U1, PAL.U3, PAL.U4, PAL.W4]);
  // the far shore: the city's line across the bay
  for (let x = 0; x < 480; x += 6) { const h = 6 + Math.floor(hash(x, 1, 9) * 18); fill(b, x, 90 - h, 6, h, t === 'afternoon' ? PAL.G5 : t === 'rain' ? PAL.G2 : PAL.U1); if (t === 'night' && hash(x, 2, 9) < 0.6) b.set(x + 2, 90 - h + 3, (Math.floor(x / 6) + cycle) % 4 === 0 ? PAL.W8 : PAL.W5); }
  vramp(b, 0, 90, 480, 20, t === 'night' ? [PAL.N1, PAL.N0] : t === 'afternoon' ? [PAL.C5, PAL.C4] : t === 'rain' ? [PAL.G2, PAL.N3] : [PAL.U2, PAL.N2]);
};
export const bridgeDeck = (b: Buf, f: number, st: DeckSt = {}, cast: {far?: (b: Buf) => void; near?: (b: Buf) => void} = {}) => {
  const t = st.time ?? 'evening', cycle = st.cycle ?? 0;
  sky(b, t, cycle, !!st.flash);
  if (st.umbrella) drawProbUmbrella(b, 430, 70);
  if (st.cloud) drawStormCloud(b, 170, 4, f, {rain: t === 'rain', flash: st.flash});
  if (st.blimp) drawBlimp(b, st.blimp.x ?? 330, st.blimp.y ?? 34, st.blimp.size, {lights: st.blimp.lights, sag: st.blimp.sag});
  // the tower and its cables (the suspension span), the lights along the cable
  fill(b, 60, 10, 8, 110, PAL.G3); fill(b, 62, 10, 4, 110, PAL.G4); fill(b, 56, 40, 16, 4, PAL.G3);
  for (let x = 0; x < 480; x++) { const y = Math.round(14 + Math.pow((x - 64) / 420, 2) * 80); b.set(x, y, PAL.G4); if (x % 24 === 0) { line(x, y, x, 118, b.ink(PAL.G2)); if (t === 'night') b.set(x, y, [PAL.W8, PAL.W6, PAL.W4, PAL.W6][(Math.floor(x / 24) + cycle) % 4]); } }
  // the far pedestrian lane (the Forecaster's: the cast's `far`), its rail
  fill(b, 0, 112, 480, 6, PAL.G3); fill(b, 0, 110, 480, 2, PAL.G5); for (let x = 0; x < 480; x += 8) fill(b, x, 104, 1, 6, PAL.G4);
  cast.far?.(b);
  // five lanes: asphalt, dashed lines; the receipt across them; cars stalled on it (or moving, May 20)
  vramp(b, 0, 118, 480, 64, t === 'night' ? [PAL.N1, PAL.N2] : t === 'rain' ? [PAL.N2, PAL.N3] : [PAL.G1, PAL.G2]);
  for (let l = 1; l < 5; l++) for (let x = (l * 7 + (st.moving ? f * 3 : 0)) % 24; x < 480; x += 24) fill(b, x, 118 + l * 13, 10, 1, PAL.P1);
  if (st.receipt === 'fresh' || st.receipt === 'run') drawReceiptLane(b, 0, 480, 140, 16, (st.scroll ?? 0) + f, {run: st.receipt === 'run' ? 1 + (Math.floor(f / 8) % 3) : 0});
  if (st.receipt === 'flat') for (let l = 0; l < 5; l++) for (let x = 0; x < 480; x += 3) if (hash(x, l, 5) < 0.5) b.set(x, 121 + l * 13 + 6, PAL.P0);
  for (let l = 0; l < 5; l++) for (let k = 0; k < 7; k++) {
    const x = ((k * 76 + l * 31) % 520) - 30 + (st.moving ? (f * (2 + l % 2)) % 76 : 0);
    drawCar(b, x, 130 + l * 13, l * 7 + k, {dim: t === 'night' ? 2 : t === 'rain' ? 1 : 0, lights: t === 'night' || t === 'rain', driver: true});
  }
  // the near pedestrian lane (Mas's), its rail in front
  fill(b, 0, 182, 480, 21, PAL.G2); fill(b, 0, 182, 480, 1, PAL.G4);
  cast.near?.(b);
  fill(b, 0, 196, 480, 2, PAL.G4); for (let x = 0; x < 480; x += 10) fill(b, x, 186, 2, 10, PAL.G3);
  // rain: short slanted strokes over everything (held on 2s), the ink running on the lanes
  if (t === 'rain') for (let k = 0; k < 220; k++) { const rx = Math.floor(hash(k, 1, Math.floor(f / 2)) * 480), ry = Math.floor(hash(k, 2, Math.floor(f / 2)) * 200); b.set(rx, ry, PAL.G5); b.set(rx - 1, ry + 1, PAL.G4); b.set(rx - 2, ry + 2, PAL.G3); }
  if (t === 'night') for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.12) b.set(x, y, stepColor(b.get(x, y), -1));
};
/** the quick run: three parallax planes (far city, mid towers, near lanes and the receipt), scrolling whole pixels */
export const receiptRun = (b: Buf, f: number, st: {scroll?: number} = {}) => {
  const s = st.scroll ?? f * 4;
  sky(b, 'evening', 0, false);
  // far: shift the city by s/6 (redraw offset)
  const far = new Buf(480, 270, PAL.N0); sky(far, 'evening', 0, false);
  for (let y = 60; y < 110; y++) for (let x = 0; x < 480; x++) b.set(x, y, far.c[y * 480 + ((x + Math.floor(s / 6)) % 480)]);
  // mid: the towers and cables by s/2
  for (let k = 0; k < 4; k++) { const tx = ((k * 200 - Math.floor(s / 2)) % 800 + 800) % 800 - 160; fill(b, tx, 10, 8, 110, PAL.G3); fill(b, tx + 2, 10, 4, 110, PAL.G4); }
  // near: the lanes and the receipt running across all five, by s
  vramp(b, 0, 118, 480, 85, [PAL.G1, PAL.G2]);
  for (let l = 0; l < 5; l++) { for (let x = (-s % 24 + 24) % 24; x < 480; x += 24) fill(b, x, 118 + l * 15, 10, 1, PAL.P1); drawCar(b, ((l * 97 - s) % 600 + 600) % 600 - 60, 132 + l * 15, l * 3, {driver: true}); }
  drawReceiptLane(b, 0, 480, 150, 22, s);
};
// ------------------------------------------------------------------ the DRIVER (§2.2): a bust in his car window
// his own head (an everyday man, nobody real): a broad, weathered face (a wide jaw, a big round nose, heavy cheeks, the
// lines of a working life), a navy baseball cap, a red work jacket
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
const RED: number[] = [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.W5];
export const driverWindow = (b: Buf, f: number, st: {mouth?: BustState['mouth']; expr?: BustState['expr']; lean?: boolean} = {}) => {
  // [M] the side of his car fills the frame: the red body round a window, the dark cabin behind him, the driver
  // leaning out of the open window: his arm from his shoulder to the elbow on the sill, the forearm along it, the hand
  // hanging over its edge (the art review: the arm was a bar that never met his shoulder)
  fill(b, 0, 0, 480, RH, PAL.R1); vramp(b, 0, 0, 480, 30, [PAL.U3, PAL.U2]);
  fill(b, 0, 28, 480, 4, PAL.R2);
  fill(b, 110, 36, 320, 142, PAL.N0); fill(b, 114, 40, 312, 134, PAL.N1); vramp(b, 114, 40, 312, 134, [PAL.N1, PAL.N2, PAL.N1]);
  fill(b, 270, 44, 4, 130, PAL.N0);
  const bx = 140, by = 60;
  putBustCut(b, driverBust({mouth: st.mouth ?? 'rest', expr: st.expr ?? 'neutral'}), bx, by, RH);
  const lean = st.lean !== false;
  // he sits low: the upper arm is below the window line, behind the door; the elbow comes up onto the sill beside
  // him, the forearm lies along the sill's rubber, and the hand hangs over the door's outer edge
  const el: [number, number] = [bx + 10, 169], wr: [number, number] = [bx - 48, 171];
  // the door below the window line (over his chest), the sill's rubber, the handle
  fill(b, 0, 174, 480, 29, PAL.R2); fill(b, 0, 174, 480, 3, PAL.N0); fill(b, 0, 177, 480, 2, PAL.R3); fill(b, 330, 188, 34, 4, PAL.G4);
  if (lean) {
    sleeve(b, el, wr, 8.5, 7, RED, [-0.55, -0.83], {fold: false});
    // the cuff's shadow on the door under the hand
    fill(b, wr[0] - 10, 177, 18, 2, PAL.R1);
    const h = placeHand(POSES.open([-0.3, 0.94, 0.1], [-0.15, -0.3, 0.94], 'R'), {s: 3.4, at: [wr[0] + 2, wr[1] + 1], anchor: 'wrist', light: 'lobby', cuffRamp: [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R2, PAL.R3, PAL.W5]});
    drawHand(b, h.hand, h.x, h.y);
  }
};
export const penChain = (b: Buf, f: number, st: {rise?: number} = {}) => {
  // [LOW] the receipt at lane level filling the bottom, the pen rising out of it on a bank chain toward the Forecaster
  vramp(b, 0, 0, 480, RH, [PAL.U2, PAL.U3, PAL.U3]);
  drawReceiptStrip(b, 120, 120, 240, 83, f, {});
  const r = clamp(st.rise ?? 1, 0, 1), top = Math.round(170 - r * 110);
  for (let y = 170; y > top + 30; y -= 3) { b.set(240 + ((y >> 1) & 1), y, PAL.G5); b.set(240 + ((y >> 1) & 1), y + 1, PAL.G3); }
  fill(b, 234, top, 12, 30, PAL.N1); fill(b, 234, top, 12, 2, PAL.G4); fill(b, 238, top + 30, 4, 6, PAL.G6);
};
export const scramblePhone = (b: Buf, f: number, st: {step?: 0 | 1 | 2 | 3 | 4} = {}) => {
  // the phone close in his hands (his thumbs, the hoodie's cuffs), the screen's stack of things
  vramp(b, 0, 0, 480, RH, [PAL.N0, PAL.N1, PAL.N1]);
  fill(b, 140, 6, 200, 197, PAL.G1); fill(b, 146, 14, 188, 189, PAL.N2);
  const step = st.step ?? 4;
  // 1: staff screenshots of a clause (cropped paper, highlighted), 2: the grey LEGAL tile (`call me`), 3: a second
  // request for comment, 4: the outgoing call to LEGAL, then a draft as grey bars
  if (step >= 1) { fill(b, 152, 20, 176, 40, PAL.P2); for (let r = 0; r < 4; r++) fill(b, 158, 26 + r * 8, 150 - r * 20, 3, r === 1 ? PAL.W7 : PAL.G5); tiny(b, 'CLAUSE', 160, 52, PAL.N2); }
  if (step >= 2) { fill(b, 152, 66, 176, 26, PAL.N3); ellipse(170, 79, 9, 9, b.ink(PAL.G4)); pt(b, 'LEGAL', 186, 70, PAL.G6); pt(b, 'call me', 186, 80, PAL.N7); }
  if (step >= 3) { fill(b, 152, 98, 176, 22, PAL.N3); fill(b, 158, 102, 8, 14, PAL.P2); pt(b, 'request for comment', 172, 106, PAL.P2); }
  if (step >= 4) { fill(b, 152, 126, 176, 30, PAL.L1); pt(b, 'calling...', 160, 130, PAL.P2); ellipse(310, 140, 8, 8, b.ink(PAL.G4)); fill(b, 152, 162, 176, 34, PAL.N1); for (let r = 0; r < 3; r++) fill(b, 158, 168 + r * 8, [140, 100, 60][r] - ((f >> 2) % 3) * 12 * (r === 2 ? 1 : 0), 4, PAL.G4); }
};
/** the scramble with his hands round it: both hands cup the phone's lower half, his thumbs on the screen (the hoodie's
 *  cuffs below), the monitor-dark evening light */
export const scrambleInHands = (b: Buf, f: number, st: {step?: 0 | 1 | 2 | 3 | 4} = {}) => {
  const r = {x: 140, y: 6, w: 200, h: 197};
  const HOOD = [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.U4];
  const SL = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.U4];
  const tmp = new Buf(480, 270, PAL.N0);
  scramblePhone(tmp, f, st);
  const phone = (bb: Buf) => { for (let y = r.y; y < r.y + r.h; y++) for (let x = r.x; x < r.x + r.w; x++) bb.set(x, y, tmp.c[y * 480 + x]); };
  vramp(b, 0, 0, 480, RH, [PAL.N0, PAL.N1, PAL.N1]);
  const thumbs = Math.floor(f / 4) % 2;
  // two hands round one phone: the right hand's fingers behind it, the phone, its thumb; then the left hand drawn on its
  // own layer with the phone as a stencil (its fingers behind the phone stay hidden, only its thumb crosses the
  // screen), so neither hand's back fingers paint over the phone (the first pass drew the second hand's palm on top).
  // Warm skin a rung down in the evening, not the monitor's cyan.
  holdPhone(b, r, {side: 'R', grip: 'cup', light: 'lobby', skinMap: skinDown(1), widthCm: 8, thumbAt: 0.55 - thumbs * 0.2, cuffRamp: HOOD, sleeveRamp: SL, sleeveTo: [420, 300], drawPhone: phone});
  const STENCIL = 0x1000001;
  const tL = new Buf(480, 270, TR);
  holdPhone(tL, r, {side: 'L', grip: 'cup', light: 'lobby', skinMap: skinDown(1), widthCm: 8, thumbAt: 0.35 + thumbs * 0.2, cuffRamp: HOOD, sleeveRamp: SL, sleeveTo: [60, 300], drawPhone: (bb) => fill(bb, r.x, r.y, r.w, r.h, STENCIL)});
  for (let i = 0; i < tL.c.length; i++) { const v = tL.c[i]; if (v !== TR && v !== STENCIL) b.c[i] = v; }
};
export const voiceMenu = (b: Buf, f: number, st: {paused?: boolean; thumb?: boolean} = {}) => {
  vramp(b, 0, 0, 480, RH, [PAL.N2, PAL.N3, PAL.N3]);
  fill(b, 120, 4, 240, 199, PAL.G1); fill(b, 126, 12, 228, 191, PAL.N2);
  pt(b, 'VOICE', 134, 18, PAL.P2);
  for (let i = 0; i < 5; i++) {
    const y = 34 + i * 30, five = i === 4, grey = five && st.paused;
    fill(b, 132, y, 216, 26, grey ? PAL.G3 : PAL.N3); fill(b, 132, y, 216, 1, grey ? PAL.G4 : PAL.N5);
    pt(b, five && st.paused ? 'VOICE 5 [PAUSED]' : `VOICE ${i + 1}`, 140, y + 4, grey ? PAL.G5 : PAL.P2);
    for (let k = 0; k < 30; k++) { const h = grey ? 1 : 1 + Math.round(hash(i, k + Math.floor(f / 3), 4) * 8); fill(b, 140 + k * 4, y + 20 - h, 2, h, grey ? PAL.G4 : PAL.C6); }
    if (five) { fill(b, 290, y + 4, 50, 16, grey ? PAL.G4 : PAL.C3); pt(b, 'Pause', 296, y + 8, grey ? PAL.G5 : PAL.P2); pt(b, 'Hey.', 140, y + 12 + 2, grey ? PAL.G5 : PAL.C8); }
  }
  // rain beading on the glass (held), his wet thumb on Pause
  for (let k = 0; k < 40; k++) { const x = 130 + Math.floor(hash(k, 1, 3) * 220), y = 14 + Math.floor(hash(k, 2, 3) * 180); b.set(x, y, PAL.C8); b.set(x, y + 1, PAL.C5); }
  // his wet thumb on Pause: the hand round the phone's right side (the fingers behind it), the thumb across to the
  // button, the cuff and the sleeve out of frame
  if (st.thumb !== false) {
    const h = placeHand(POSES.grip([-0.35, -0.94, 0], [0.15, 0, -1], 'R', 0.3), {s: 9, at: [326, 166], anchor: 'thumb', light: 'lobby', skinMap: skinDown(1), cuffRamp: [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.C4]});
    sleeve(b, h.cuffEnd, [h.cuffEnd[0] + 40, 260], 26, 30, [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.C4]);
    // behind the phone but for the thumb, which lies across its face to the button
    drawHand(b, h.hand, h.x, h.y, {caps: (id, x, y) => id.startsWith('t') || x < 120 || x >= 360 || y < 4 || y >= 203});
  }
};

export const ART: ArtAsset[] = [
  {
    id: 'set16-bridge', manifest: 'SET-16 · the Bay Bridge, mid-span (evening rush, the night, the afternoon, May 20 in rain)', kind: 'set', name: 'The Bay Bridge: the receipt across five lanes, the night, the rain',
    file: 'sets/bridge.ts', exports: 'bridgeDoors, receiptRun, bridgeDeck, drawCar, penChain, scramblePhone, scrambleInHands, voiceMenu', scenes: '17',
    note: 'NopeAI\'s doors at the top of the hill, the receipt pouring out; stalled traffic on it; the night\'s palette cycle (no strobe); May 20 rain, the storm cloud\'s blank letterhead, the sagging blimp',
    stills: [
      {label: '[W] 17.01: the cathedral\'s front doors up the hill, the exit agreement pouring out like a receipt, the Forecaster arriving from the street', draw: (b) => bridgeDoors(b, 0, {pour: 1}, (bb) => drawForecasterRoom(bb, 330, 190, {state: 'walk', legs: 'w2'}, {flip: true}))},
      {label: '[W] 17.03-17.07: mid-span, evening rush: five lanes stalled on the receipt, the Forecaster on the far lane, Mas small on the near one', draw: (b) => bridgeDeck(b, 0, {time: 'evening', receipt: 'fresh'}, {far: (bb) => drawForecasterRoom(bb, 360, 112, {state: 'talk', mouth: 'open'}, {flip: true}), near: (bb) => drawMasStand2(bb, 90, 200, {arm: 'phone', bow: true, light: 'dusk'})})},
      {label: '[W] 17.14 the night (the lights\' one cycle)', draw: (b) => bridgeDeck(b, 0, {time: 'night', cycle: 1, receipt: 'fresh'}, {near: (bb) => drawMasStand2(bb, 90, 200, {arm: 'down', light: 'sil'})})},
      {label: '[W] 17.17 May 20: traffic moving, the receipt trodden flat, Mas under an umbrella, the cloud\'s blank letterhead, the blimp', draw: (b) => bridgeDeck(b, 6, {time: 'rain', receipt: 'flat', moving: true, cloud: true, blimp: {size: 3, lights: 2, sag: 3}, umbrella: true}, {near: (bb) => drawMasStand2(bb, 90, 200, {arm: 'umbrella', light: 'room'}, {f: 6})})},
      {label: '[W] 17.02 the quick run (three parallax planes)', draw: (b) => receiptRun(b, 0, {scroll: 40})},
      {label: '[LOW] 17.04 the pen on its bank chain', draw: (b) => penChain(b, 0, {rise: 1})},
      {label: '[ECU] 17.08-17.10 the scramble in his hands: a clause, the grey LEGAL tile, a second request for comment, the call, a draft as grey bars', draw: (b) => scrambleInHands(b, 0, {step: 4})},
      {label: '[POV] 17.19 the voice menu, VOICE 5 [PAUSED]', draw: (b) => voiceMenu(b, 0, {paused: true})},
    ],
  },
  {
    id: 'char-driver', manifest: '§2.2 the DRIVER', kind: 'character', name: 'The DRIVER (an everyday voice through a car window)',
    file: 'sets/bridge.ts', exports: 'driverWindow, drawCar', scenes: '17',
    note: 'a navy cap, a red work jacket; leaning out, his arm on the sill; "can we move?" (talk), "Does honking count…?" (worry)',
    stills: [
      {label: '[M] "You gonna think it over…" (talk A, leaning out of the window, his forearm on the sill)', draw: (b) => driverWindow(b, 0, {mouth: 'A', lean: true})},
      {label: '[M] "Does honking count as disparagement?" (worry)', draw: (b) => driverWindow(b, 0, {mouth: 'O', expr: 'worry'})},
    ],
  },
  {
    id: 'creature-blimp-cloud-receipt', manifest: '§2.3 the blimp · the storm cloud · the receipt', kind: 'creature', name: 'The `her` blimp (four sizes), the storm cloud with a blank letterhead, the receipt',
    file: 'creatures.ts', exports: 'drawBlimp, drawStormCloud, drawReceiptStrip, drawReceiptLane, RECEIPT_LINES', scenes: '11, 17',
    note: 'the blimp in four held sizes, its running lights clicking off, sagging; the cloud rains letterhead; the receipt\'s lines legible: NON-DISPARAGEMENT · IN PERPETUITY · CLAUSE 9 · SAVE 0% ON YOUR NEXT EXIT',
    stills: [{label: 'the blimp sizes 1..4 (the last sagging, two lights left) · the storm cloud raining letterhead · the receipt strip', draw: (b) => {
      vramp(b, 0, 0, 480, 203, [PAL.N2, PAL.N3, PAL.N4]);
      drawBlimp(b, 30, 30, 1); drawBlimp(b, 90, 34, 2); drawBlimp(b, 180, 40, 3); drawBlimp(b, 320, 44, 4, {lights: 2, sag: 3});
      drawStormCloud(b, 10, 90, 4, {rain: true});
      drawReceiptStrip(b, 300, 92, 170, 108, 0);
    }}],
  },
];
void rect; void poly; void lightness; void pwrap; void bpt; void bpw; void tinyWidth; void TR; void dith; void hramp;
