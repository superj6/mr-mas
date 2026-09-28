// MR. MAS — shared room: EXT. A ROOFTOP SIGNING TABLE — DAY (Ep1 sc 17; new file, owned by the `v3-art-b` pass). A 480 x
// 203 room plate and its setups. The script's PLAN, kept: the long table runs across the frame under the sky, the sheet
// at its centre; the signers queue in from frame right and sign facing us; MAS and MARIO sign last and stay at the
// table, Mas frame left of Mario; the register rolls in from frame right and NESNEJ stands behind it at frame right,
// facing left; the crack runs across the sky left to right. A perfect blue sky (the show's one open daylight: the
// periwinkle F / N8 / G6 ramp), a stone parapet, the city's tops far below in haze; a white tablecloth.
//
// Entry points (each paints rows 0..202 of `b`; deterministic on its state):
//   drawRooftopWide(b, f, st)    [W] (17.01, 17.03, 17.04, 17.11): `signers` who is at the table (the queue from the
//                                right, each signing in turn), `register` its roll-in position 0 (off) .. 1 (stopped at
//                                Nesnej), `crack` 0..1 its whole-pixel run L -> R (12 frames), `look` who looks up
//   drawQuoteBox(b, s, typed)    the statement typing across the top of the sky, held to read (a GFX plate)
//   drawRooftop2S(b, f, st)      [2S] (17.02, 17.05) MAS + MARIO at the sheet: Mario writing under his name, the pen
//                                tight; Mas's hand out for it; `turn` both look right to the register (O.S.)
//   drawRooftopOTS(b, f, st)     [OTS] (17.06) from behind Mario (his shoulder and his raised finger big, frame left)
//                                onto NESNEJ behind the register, frame right, arms spread like a gift
//   drawGlassCrack(b, f, st)     [ECU] (17.12) Mas's glass on the table: the crack in the water, the water not moving;
//                                `run` 0..3 the reflected crack's extra whole-pixel steps after the sky's has stopped,
//                                until it runs across his small reflection
import {Buf, rect, line, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg, Img} from '../figure';
import {text, textWidth} from '../font';
import {pt, pw, pwrap} from '../kits/uitype';
import {drawSigner} from '../cast/civic-extras';
import {drawNesnejRoom, nesnejBust, NESNEJ_BUST_DEFAULT, NesnejBustState} from '../cast/nesnej';
import {drawMasStand, MAS_STAND_DEFAULT} from '../cast/mas-stand';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {marioImg, MARIO_BASE, MARIO_FOOT, marioPortraitImg, MARIO_PORTRAIT_REST, MarioPortrait} from '../cast/mario';
import {drawRegisterRoom, drawRegisterBust, REG_BUST} from '../kits/register';
import {drawIndexUp} from './whitehouse';
import {putBustCut} from '../cast/civic-kit';

const RH = 203;
export const ROOF = {
  horizon: 118, parapet: 128, deck: 140,
  table: {x0: 60, x1: 380, top: 150, front: 156, foot: 184},
  sheet: {x: 226, y: 151, w: 22, h: 5},
  mas: 200, mario: 262, nesnej: 446, regStop: 392,
  signFoot: 170, signX: 238,
  /** the queue: where the next signers wait (feet), from the table toward frame right */
  queue: [296, 330, 364] as number[],
  glass: {x: 186, y: 144},
};
// ------------------------------------------------------------------ the sky and the city (cached)
const SKY = new Map<number, Buf>();
/** the sky, the city far below, the parapet and the deck, laid out for a horizon line (the wide's, or a closer setup's
 *  lower one: each is laid out afresh at its own line, never a stretch of another) */
const paintSky = (horizonY = ROOF.horizon): Buf => {
  const hit = SKY.get(horizonY);
  if (hit) return hit;
  const b = new Buf(480, RH, PAL.N0);
  const dH = horizonY - ROOF.horizon;
  const R0 = {horizon: horizonY, parapet: ROOF.parapet + dH, deck: ROOF.deck + dH};
  const R = [PAL.F4, PAL.F5, PAL.N8, PAL.F6, PAL.G6];
  for (let y = 0; y < R0.horizon; y++) for (let x = 0; x < 480; x++) {
    const t = y / R0.horizon + (bayer(x, y) - 0.5) * 0.14;
    b.set(x, y, R[clamp(Math.floor(t * R.length), 0, R.length - 1)]);
  }
  // the city's tops far below and away, in haze: pale blue-grey blocks, a few windows catching the sun
  for (let s = 0, x = -10; x < 490; s++) {
    const w = 8 + Math.floor(hash(s, 1, 61) * 18), top = R0.horizon - 6 - Math.floor(hash(s, 2, 61) * 22);
    for (let y = top; y < R0.parapet; y++) for (let i = 0; i < w; i++) b.set(x + i, y, i === 0 ? PAL.P1 : y < top + 2 ? PAL.G6 : PAL.G5);
    for (let y = top + 3; y < R0.parapet; y += 3) for (let i = 2; i < w - 1; i += 3) if (hash(x + i, y, 62) < 0.12) b.set(x + i, y, PAL.P2);
    x += w + 1 + Math.floor(hash(s, 3, 61) * 4);
  }
  // the parapet: pale stone coping, its lit top edge; the deck: stone pavers receding
  rect(0, R0.parapet, 480, 3, b.ink(PAL.P2)); rect(0, R0.parapet + 3, 480, R0.deck - R0.parapet - 3, b.ink(PAL.P0));
  for (let x = 0; x < 480; x += 40) rect(x, R0.parapet + 3, 1, R0.deck - R0.parapet - 3, b.ink(PAL.G4));
  for (let y = R0.deck; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = y - R0.deck, jx = ((x - 240) * (1 + d / 60)) | 0;
    const seam = d % 12 === 0 || ((jx % 48) + 48) % 48 === 0;
    b.set(x, y, seam ? PAL.G5 : bayer(x, y) < 0.3 ? PAL.P0 : PAL.G6);
  }
  SKY.set(horizonY, b);
  return b;
};
/** the crack across the sky: a hairline that runs L -> R in whole-pixel steps, dark with a bright lip; t 0..1 */
export const crackPath = (): Array<[number, number]> => {
  // v3.1 (17.11 shot note: "jagged and white, never a chart line"): runs of 3-9 px, each turning by 2-5 px, so the line
  // zigzags like a crack in glass
  const pts: Array<[number, number]> = [];
  let y = 38, run = 0, dy = 0;
  for (let x = 0; x < 480; x++) {
    if (run <= 0) { run = 3 + Math.floor(hash(x, 5, 71) * 7); dy = (hash(x, 7, 71) < 0.5 ? -1 : 1) * (hash(x, 9, 71) < 0.5 ? 1 : 0); if (hash(x, 11, 71) < 0.35) y += (hash(x, 13, 71) < 0.5 ? -1 : 1) * (2 + Math.floor(hash(x, 15, 71) * 3)); }
    run--; y += dy * (run % 2);
    y = clamp(y, 24, 56);
    pts.push([x, y]);
  }
  return pts;
};
const CRACK = crackPath();
export const drawCrack = (b: Buf, t: number, o: {dy?: number; x0?: number; x1?: number; clip?: (x: number, y: number) => boolean} = {}) => {
  const n = Math.round(clamp(t, 0, 1) * 480);
  const put = (X: number, Y: number, c: number) => { if (!o.clip || o.clip(X, Y)) b.set(X, Y, c); };
  for (let i = 0; i < n; i++) {
    const [x, y] = CRACK[i];
    const X = x, Y = y + (o.dy ?? 0);
    const [, yp] = CRACK[Math.max(0, i - 1)];
    // the white core (the gap in the sky), filled vertically where the line jumps, a dark hairline under it
    for (let yy = Math.min(Y, yp + (o.dy ?? 0)); yy <= Math.max(Y, yp + (o.dy ?? 0)); yy++) put(X, yy, PAL.W9);
    put(X, Y + 1, PAL.N3);
    // short white splinters off the turns
    if (hash(x, 3, 72) < 0.06) { put(X + 1, Y - 1, PAL.W9); put(X + 2, Y - 2, PAL.P2); }
    if (hash(x, 5, 72) < 0.04) { put(X + 1, Y + 2, PAL.P2); put(X + 2, Y + 3, PAL.G6); }
  }
};

// ------------------------------------------------------------------ the quote box (17.01)
export const drawQuoteBox = (b: Buf, s: string, typed = 999) => {
  const lines = pwrap(s, 360);
  const w = 380, h = 14 + lines.length * 11;
  const x = 50, y = 8;
  rect(x, y, w, h, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(PAL.G5)); rect(x, y, 2, h, b.ink(PAL.W6));
  let left = typed;
  lines.forEach((l, i) => { const t = l.slice(0, Math.max(0, left)); left -= l.length + 1; pt(b, t, x + 12, y + 7 + i * 11, PAL.P2); });
};

// ------------------------------------------------------------------ the wide
export type RoofSigner = {v: 0 | 1 | 2; at: 'queue0' | 'queue1' | 'queue2' | 'sign' | 'leave'};
export interface RooftopWideState {
  signers?: RoofSigner[];
  /** Mas / Mario: 'stand' at their marks · 'sign' at the sheet · null (not yet there) */
  mas?: 'stand' | 'sign' | 'reach' | null;
  mario?: 'stand' | 'write' | 'finger' | null;
  register?: number;
  nesnej?: {arm?: 'spread' | 'key' | 'down'; mouth?: 'grin' | 'open'} | null;
  crack?: number;
  /** who has looked up at the crack */
  look?: {nesnej?: boolean; mario?: boolean; mas?: 'up' | 'glass'};
}
export const drawRooftopWide = (b: Buf, f: number, st: RooftopWideState = {}) => {
  const sky = paintSky();
  b.c.set(sky.c.subarray(0, 480 * RH));
  if (st.crack) drawCrack(b, st.crack);
  const clipT = (_x: number, y: number) => y < ROOF.table.top + 1;
  // the queue and the signer at the sheet (behind the table, facing us: 3/4 to camera-left, toward the sheet)
  for (const s of st.signers ?? []) {
    if (s.at === 'sign') drawSigner(b, ROOF.signX, ROOF.signFoot + 14, s.v, 'sign', {flip: true, clip: clipT});
    else if (s.at === 'leave') drawSigner(b, 140, ROOF.signFoot + 14, s.v, 'walk', {flip: true, f, clip: clipT});
    else drawSigner(b, ROOF.queue[+s.at.slice(-1)], ROOF.signFoot + 14, s.v, 'stand', {flip: true, clip: clipT});
  }
  // MAS and MARIO at the table (standing behind it; Mas frame left)
  if (st.mas) drawMasStand(b, ROOF.mas, ROOF.signFoot + 14, {...MAS_STAND_DEFAULT, arm: st.mas === 'reach' ? 'reach' : 'down', blink: st.look?.mas === 'glass'}, {clip: st.mas === 'reach' ? undefined : clipT});
  if (st.mario) {
    const img = marioImg({...MARIO_BASE, arm: st.mario === 'finger' ? 'raise' : st.mario === 'write' ? 'chest' : 'down', brow: st.look?.mario ? 1 : 0});
    blitImg(b, img, ROOF.mario - (img.w - 1 - MARIO_FOOT[0]), ROOF.signFoot + 14 - MARIO_FOOT[1], {flip: true, clip: clipT});
  }
  // NESNEJ behind where the register will stop
  if (st.nesnej !== null && st.nesnej !== undefined) drawNesnejRoom(b, ROOF.nesnej, ROOF.signFoot + 18, {arm: st.nesnej.arm ?? 'spread', mouth: st.nesnej.mouth ?? 'grin'}, {flip: true});
  // the table: a white cloth to the deck, the sheet at its centre, Mas's glass
  const T = ROOF.table;
  for (let y = T.top; y < T.foot; y++) for (let x = T.x0; x < T.x1; x++) {
    const fold = y > T.front && (x - T.x0) % 26 === 0;
    b.set(x, y, y === T.top ? PAL.W9 : y < T.front ? PAL.P2 : fold ? PAL.G6 : y > T.foot - 3 ? PAL.G5 : bayer(x, y) < 0.2 ? PAL.P1 : PAL.P2);
  }
  rect(T.x0, T.foot, T.x1 - T.x0, 2, b.ink(PAL.G4));
  const S = ROOF.sheet;
  rect(S.x, S.y, S.w, S.h, b.ink(PAL.W9)); for (let i = 3; i < S.w - 3; i++) if (i % 3) b.set(S.x + i, S.y + 2, PAL.G5);
  const g = ROOF.glass;
  rect(g.x, g.y, 4, 7, b.ink(PAL.C4)); b.set(g.x, g.y + 2, PAL.C8); rect(g.x, g.y + 2, 4, 1, b.ink(PAL.C6)); b.set(g.x + 3, g.y + 6, PAL.C2);
  // the register rolls in on the deck past the table's end, in front of NESNEJ
  if (st.register !== undefined && st.register > 0) {
    const x = Math.round(520 - (520 - ROOF.regStop) * clamp(st.register, 0, 1));
    drawRegisterRoom(b, x, ROOF.signFoot + 24, {roll: st.register < 1 ? Math.floor(f / 2) : 0, flags: st.nesnej?.arm === 'key'});
  }
};

// ------------------------------------------------------------------ the two-shot at the sheet (17.02, 17.05)
export interface Rooftop2SState {
  mas?: Partial<MasPortraitState>;
  mario?: Partial<MarioPortrait>;
  /** both have turned to the register, frame right */
  turn?: boolean;
  /** Mas's hand out for the pen: 0 in · 1 half · 2 all the way out */
  hand?: 0 | 1 | 2;
  /** Mario's writing hand: 0 · 1 (the pen's two held drawings) · null when he looks up */
  write?: 0 | 1 | null;
  /** the footnote's length under Mario's name (lines) */
  footnote?: number;
}
export const ROOF2S = {mas: 60, mario: 250, y: 24, table: 146};
export const drawRooftop2S = (b: Buf, f: number, st: Rooftop2SState = {}) => {
  // a step closer: the horizon and the parapet sit lower in the frame, behind their shoulders
  const sky = paintSky(150);
  b.c.set(sky.c.subarray(0, 480 * RH));
  const turn = !!st.turn;
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: turn ? 1 : 0, ...st.mas}), ROOF2S.mas, ROOF2S.y, ROOF2S.table, true);
  putBustCut(b, marioPortraitImg({...MARIO_PORTRAIT_REST, blink: st.write !== null && !turn ? 1 : 0, ...st.mario}), ROOF2S.mario, ROOF2S.y, ROOF2S.table, !turn);
  // the table's cloth close: the sheet, the signatures in a column, Mario's footnote growing under his
  for (let y = ROOF2S.table; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === ROOF2S.table ? PAL.W9 : bayer(x, y) < 0.12 ? PAL.P1 : PAL.P2);
  const sx = 160, sy = ROOF2S.table + 6, sw = 160, sh = RH - sy;
  rect(sx + 2, sy + 2, sw, sh, b.ink(PAL.G6)); rect(sx, sy, sw, sh, b.ink(PAL.W9)); rect(sx, sy, sw, 1, b.ink(PAL.P2));
  for (let i = 12; i < sw - 12; i++) if (i % 4) b.set(sx + i, sy + 5, PAL.G4);
  const sig = (y: number, x0: number, seed: number) => { let yy = y; for (let i = 0; i < 40; i++) { if (hash(i, seed, 3) < 0.4) yy += hash(i, seed, 4) < 0.5 ? -1 : 1; yy = clamp(yy, y - 2, y + 2); b.set(sx + x0 + i, yy, PAL.N4); } };
  sig(sy + 14, 20, 1); sig(sy + 22, 70, 2); sig(sy + 30, 24, 3); sig(sy + 38, 90, 4);
  const fn = st.footnote ?? 2;
  for (let k = 0; k < fn; k++) for (let i = 0; i < 70 - (k === fn - 1 ? 30 : 0); i++) if ((i * 7 + k) % 11 !== 0) b.set(sx + 92 + i - (k > 1 ? 40 : 0), sy + 46 + k * 4, PAL.I0);
  // Mario's hand writing (the pen tight, two held drawings), in from the right
  if (st.write !== null && st.write !== undefined) {
    const hx = sx + 132 + st.write * 2, hy = sy + 22 + fn * 3;
    for (let y = hy - 6; y < RH; y++) for (let x = hx; x < hx + 60; x++) if (Math.hypot((x - hx - 24) / 26, (y - hy - 10) / 16) < 1 || (x > hx + 30 && y > hy + 8)) b.set(x, y, x > hx + 40 && y > hy + 12 ? PAL.F3 : x < hx + 16 ? PAL.S5 : PAL.S4);
    line(hx + 4, hy + 2, hx - 6, hy + 10, b.ink(PAL.N0)); line(hx + 5, hy + 2, hx - 5, hy + 10, b.ink(PAL.N2)); b.set(hx - 7, hy + 11, PAL.W6); // the pen
  }
  // Mas's hand out for the pen, palm up, from the left
  if (st.hand) {
    const reach = st.hand === 2 ? 40 : 18, hx = sx - 60 + reach, hy = ROOF2S.table + 18;
    for (let y = hy - 8; y < hy + 14; y++) for (let x = 0; x < hx + 30; x++) {
      const palm = Math.hypot((x - hx - 14) / 18, (y - hy) / 8) < 1, arm = x < hx + 2 && y > hy - 6 && y < hy + 12;
      if (palm) b.set(x, y, y < hy - 2 ? PAL.S5 : PAL.S4);
      else if (arm) b.set(x, y, y < hy - 2 ? PAL.G4 : PAL.G2);
    }
    for (const k of [0, 1, 2, 3]) b.set(hx + 26 + (k >> 1), hy - 6 + k * 3, PAL.S3);
  }
};

// ------------------------------------------------------------------ the OTS from behind Mario onto NESNEJ (17.06)
export interface RooftopOTSState { nesnej?: Partial<NesnejBustState>; finger?: 1 | 2; press?: boolean; }
export const drawRooftopOTS = (b: Buf, f: number, st: RooftopOTSState = {}) => {
  const sky = paintSky(160);
  b.c.set(sky.c.subarray(0, 480 * RH));
  // NESNEJ behind the register, frame right, facing left (flipped: nothing on him is lettering), arms spread
  const img = nesnejBust({...NESNEJ_BUST_DEFAULT, ...st.nesnej});
  putBustCut(b, img, 296, 18, RH, true);
  drawRegisterBust(b, 250, 104, {press: st.press, flags: st.press, glint: Math.floor(f / 12)});
  // MARIO in the foreground, frame left: the back of his fleece shoulder, his curls at the edge, the raised finger
  const F = [PAL.F0, PAL.F1, PAL.F2, PAL.F3, PAL.F4];
  for (let y = 100; y < RH; y++) for (let x = 0; x < 200; x++) { const d = Math.hypot((x - 30) / 170, (y - 240) / 130); if (d <= 1) b.set(x, y, d > 0.96 ? F[3] : x > 120 ? F[2] : F[1]); }
  for (let y = 40; y < 120; y++) for (let x = 0; x < 90; x++) { const d = Math.hypot((x - 20) / 70, (y - 112) / 66); if (d > 1) continue; const curl = (Math.floor((x + y) / 5) + Math.floor((x - y) / 5)) % 2 === 0; b.set(x, y, d > 0.95 ? PAL.B2 : curl ? PAL.B1 : PAL.B0); }
  drawIndexUp(b, 122, st.finger === 1 ? 70 : 50, F);
};

// ------------------------------------------------------------------ the glass, side-on at table height (17.12, v3.1)
/**
 * v3.1's new ECU (it replaces the view from above): his glass on the white cloth at table height, the statement's sheet
 * lying beyond it, the sky behind with the crack. Seen through the glass the sky is shifted (the water bends it) and in
 * the water the crack keeps going after the sky's has stopped (`run` 0..3 whole-pixel steps) until it runs across the
 * small reflection of the man looking down into the glass. The water line one flat row: it doesn't move.
 */
export const drawGlassSide = (b: Buf, f: number, st: {run: 0 | 1 | 2 | 3; surface?: boolean}) => {
  const sky = paintSky(150);
  // the sky and the city far below at this height (the horizon behind the table), the cloth's edge at 150
  for (let y = 0; y < 150; y++) for (let x = 0; x < 480; x++) b.set(x, y, sky.get(x, y));
  const stopX = 250;
  drawCrack(b, stopX / 480);
  for (let y = 150; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, y === 150 ? PAL.W9 : bayer(x, y) < 0.12 ? PAL.P1 : PAL.P2);
  // the sheet lying flat beyond the glass: a pale sliver in perspective, its signatures a ruled grey
  for (let y = 150; y < 157; y++) for (let x = 300 - (y - 150) * 3; x < 440 + (y - 150) * 2; x++) b.set(x, y, y === 150 ? PAL.P1 : (x + y) % 9 === 0 ? PAL.G5 : PAL.W9);
  // the glass: a tall tumbler on the cloth, its walls, the water's body; what's behind it shifted 6 px (refraction)
  const gx0 = 176, gx1 = 304, gy0 = 30, gy1 = 176, wy = 70;
  const src = b.clone();
  for (let y = gy0; y < gy1; y++) for (let x = gx0; x < gx1; x++) {
    const u = (x - gx0) / (gx1 - gx0);
    const edge = u < 0.03 || u > 0.97;
    if (edge) { b.set(x, y, u < 0.5 ? PAL.C7 : PAL.C3); continue; }
    const water = y > wy;
    let c = src.get(Math.round(gx0 + (x - gx0) * (water ? 0.8 : 0.95) + (water ? 16 : 3)), water ? Math.max(0, 150 - (y - wy) * 0.9) | 0 : y); // the view through it, bent
    if (water) c = bayer(x, y) < 0.35 ? PAL.C5 : c === PAL.W9 || c === PAL.P2 ? PAL.C8 : c; // the water's tint
    if (u > 0.08 && u < 0.14) c = PAL.C8; // the lit wall's streak
    if (u > 0.86 && u < 0.9) c = PAL.C4;
    b.set(x, y, c);
  }
  rect(gx0 + 4, wy, gx1 - gx0 - 8, 1, b.ink(PAL.C9)); // the water line: one flat row
  rect(gx0, gy0, gx1 - gx0, 2, b.ink(PAL.C6)); rect(gx0, gy1 - 6, gx1 - gx0, 6, b.ink(PAL.C4)); rect(gx0, gy1 - 1, gx1 - gx0, 1, b.ink(PAL.C2));
  for (let x = gx0 + 6; x < gx1 + 10; x++) b.set(x, gy1, PAL.G6); // its shadow on the cloth
  if (st.surface) { glassSurface(b, gx0, gx1, gy0, wy, st.run); return; }
  // his small reflection on the glass's curve, low in the water: the hoodie's shoulders (half there: a reflection),
  // his hair and its cowlick, his face cool in the sky's light, the two dot eyes and the one-pixel smile
  const mx = 262, my = 128;
  for (let y = my - 12; y < my + 24; y++) for (let x = mx - 18; x < mx + 18; x++) {
    const hd = Math.hypot((x - mx) / 7, (y - my) / 9) < 1, sh = Math.hypot((x - mx) / 17, (y - my - 16) / 8) < 1 || (Math.abs(x - mx) < 3 && y > my + 6 && y < my + 11);
    if (hd) b.set(x, y, y < my - 3 || (y < my && Math.abs(x - mx) > 4) ? (x > mx + 3 ? PAL.B0 : PAL.B1) : x > mx + 3 ? PAL.K2 : PAL.K3);
    else if (sh && ((x + y) & 1) === 0) b.set(x, y, x > mx + 6 ? PAL.G1 : PAL.G2);
  }
  b.set(mx - 1, my - 10, PAL.B1); b.set(mx - 2, my - 11, PAL.B1); // the cowlick
  b.set(mx - 3, my + 1, PAL.N0); b.set(mx + 2, my + 1, PAL.N0); // the eyes
  rect(mx - 2, my + 5, 4, 1, b.ink(PAL.X1)); b.set(mx + 2, my + 4, PAL.X1); // the one-pixel smile
  // the crack in the water: the sky's line seen through the glass, and then its extra steps toward his reflection
  const steps = [gx0 + 60, gx0 + 72, gx0 + 80, mx + 2];
  let y = wy + 22;
  for (let x = gx0 + 6; x < steps[st.run]; x++) {
    if (hash(x >> 2, 21, 73) < 0.45) y += hash(x, 23, 73) < 0.5 ? -2 : 2;
    y = clamp(y, wy + 10, my - 1);
    if (x > mx - 34 && hash(x, 29, 73) < 0.55) y = Math.min(my + 2, y + 3); // it bends down across his face, still in jags
    b.set(x, y, PAL.W9); b.set(x, y + 1, PAL.N3);
  }
  void f;
};

/**
 * v3.2 (draft 8.1, the audit's #8: the reflection in the water "read as a man floating in a tank"): the camera a little
 * above the rim, so the rim and the water's surface are thin ellipses; the reflection lives ON the surface: the sky's
 * pale light, and in it his face only (the hair, the two dots, the one-pixel smile, squashed by the angle: no body, no
 * ripple ring). The reflected crack runs across the surface one whole-pixel step past where the sky's stopped, then
 * another, and on `run` 3 crosses his face and breaks it (the two halves a pixel apart).
 */
const glassSurface = (b: Buf, gx0: number, gx1: number, gy0: number, wy: number, run: 0 | 1 | 2 | 3) => {
  const cx = (gx0 + gx1) >> 1, rx = ((gx1 - gx0) >> 1) - 4, ry = 15;
  // the rim, seen from a little above: a thin ellipse, its near lip lit
  for (let a = 0; a < 360; a++) { const t = (a / 180) * Math.PI, x = Math.round(cx + Math.cos(t) * (rx + 3)), y = Math.round(gy0 + 8 + Math.sin(t) * (ry + 1)); b.set(x, y, Math.sin(t) > 0 ? PAL.C8 : PAL.C5); }
  // the surface: the sky's reflection on the water, paler toward the far side
  const inS = (x: number, y: number) => Math.hypot((x - cx) / rx, (y - wy) / ry) <= 1;
  for (let y = wy - ry; y <= wy + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
    if (!inS(x, y)) continue;
    const d = Math.hypot((x - cx) / rx, (y - wy) / ry);
    b.set(x, y, d > 0.92 ? PAL.C6 : y < wy - 3 ? (bayer(x, y) < 0.5 ? PAL.C8 : PAL.P2) : bayer(x, y) < 0.3 ? PAL.C7 : PAL.C8);
  }
  // his face on it (squashed by the angle): the hair's dark cap, the cool skin, the two dots, the smile
  const fx = cx + 20, fy = wy;
  const F = ['......hhhhhhhhh.......', '....hhhhhhhhhhhhh.....', '...hhhhhhhhhhhhhhh....', '..hhhssssssssssshhh...', '..hsssssssssssssssS...',
    '..sssseessssseessSS...', '..sssseessssseessSS...', '..sssssssssssssssSS...', '...sssssssssssssSS....', '....sssssmmmmmsmSS....', '.....ssssssssssSS.....', '.......sssssssS.......'];
  const pal: Record<string, number> = {h: PAL.B0, s: PAL.S3, S: PAL.S2, e: PAL.N0, m: PAL.S1}; // darker than the bright sky it floats on
  const breakX = run >= 3 ? fx + 1 : 999; // where the crack crosses it: the right half drops a pixel
  F.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c === undefined) continue; const X = fx - 11 + i, Y = fy - 6 + j + (X >= breakX ? 1 : 0); if (inS(X, Y)) b.set(X, Y, c); } });
  b.set(fx - 3, fy - 7, PAL.B1); b.set(fx - 4, fy - 8, PAL.B1); // the cowlick
  // the crack on the surface: in from the left edge, a step further each run, the last one across his face
  const ends = [cx - 34, cx - 14, cx + 6, fx + 14];
  let y = wy + 2;
  for (let x = cx - rx + 2; x < ends[run]; x++) {
    if (hash(x >> 1, 41, 73) < 0.4) y += hash(x, 43, 73) < 0.5 ? -1 : 1;
    y = clamp(y, wy + 1, wy + 3); // it crosses his face under the eyes
    if (!inS(x, y)) continue;
    b.set(x, y, PAL.W9); if (inS(x, y + 1)) b.set(x, y + 1, PAL.N3);
  }
  // the water line under the surface: one flat row (it doesn't move)
  rect(gx0 + 4, wy + ry + 1, gx1 - gx0 - 8, 1, b.ink(PAL.C9));
};

// ------------------------------------------------------------------ the glass (17.12)
export const drawGlassCrack = (b: Buf, f: number, st: {run: 0 | 1 | 2 | 3}) => {
  // the white cloth; the glass close, from above and in front: its rim, the water line a little below it, the walls
  // down to the base (the cloth seen through them, tinted), the base's ring and its shadow
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.15 ? PAL.P1 : PAL.P2);
  const cx = 240, rimY = 40, rx = 96, ry = 34, wy = 58, wrx = 92, wry = 31, baseY = 176, brx = 80, bry = 22;
  const inE = (x: number, y: number, ex: number, ey: number, erx: number, ery: number) => Math.hypot((x - ex) / erx, (y - ey) / ery) <= 1;
  // the shadow on the cloth (the sun from camera-left), then the walls
  for (let y = baseY - 10; y < RH; y++) for (let x = cx - 40; x < cx + brx + 70; x++) if (inE(x, y, cx + 34, baseY + 6, brx + 10, bry)) b.set(x, y, PAL.G6);
  for (let y = rimY; y <= baseY + bry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
    const t = (y - rimY) / (baseY - rimY), hw = rx - (rx - brx) * Math.min(1, t);
    if (Math.abs(x - cx) > hw) continue;
    if (y > baseY && !inE(x, y, cx, baseY, brx, bry)) continue;
    const u = (x - cx) / hw;
    let c = u < -0.86 ? PAL.C7 : u < -0.7 ? PAL.C5 : u > 0.88 ? PAL.C2 : u > 0.6 ? PAL.C3 : bayer(x, y) < 0.5 ? PAL.C6 : PAL.P1;
    if (y > wy + 8 && Math.abs(u) < 0.6) c = bayer(x, y) < 0.3 ? PAL.C5 : PAL.C6; // the water's body, seen through the wall
    b.set(x, y, c);
  }
  for (let x = cx - brx; x <= cx + brx; x++) { const y = Math.round(baseY + bry * Math.sqrt(Math.max(0, 1 - ((x - cx) / brx) ** 2))); b.set(x, y, PAL.C2); b.set(x, y - 1, PAL.C4); }
  // the rim (a bright ring), the empty band of glass above the water, the water's surface: the sky, flat
  for (let y = rimY - ry; y <= rimY + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
    if (!inE(x, y, cx, rimY, rx, ry)) continue;
    const onRim = !inE(x, y, cx, rimY, rx - 3, ry - 2);
    b.set(x, y, onRim ? (x < cx ? PAL.W9 : PAL.C7) : PAL.C6);
  }
  const R = [PAL.F5, PAL.N8, PAL.F6, PAL.G6];
  for (let y = wy - wry; y <= wy + wry; y++) for (let x = cx - wrx; x <= cx + wrx; x++) {
    if (!inE(x, y, cx, wy, wrx, wry) || !inE(x, y, cx, rimY, rx - 3, ry - 2) && y < rimY) continue;
    if (!inE(x, y, cx, wy, wrx, wry)) continue;
    const t = (y - (wy - wry)) / (2 * wry) + (bayer(x, y) - 0.5) * 0.15;
    b.set(x, y, R[clamp(Math.floor(t * R.length), 0, R.length - 1)]);
  }
  for (let x = cx - wrx; x <= cx + wrx; x++) { const y = Math.round(wy + wry * Math.sqrt(Math.max(0, 1 - ((x - cx) / wrx) ** 2))); b.set(x, y, PAL.C8); } // the water line: flat
  // his small reflection in it: a man looking down into the glass, his face dark against the sky, the cowlick
  const mx = cx + 34, my = wy + 4;
  const inM = (x: number, y: number) => inE(x, y, mx, my, 8, 10) || inE(x, y, mx, my + 18, 20, 8);
  for (let y = my - 12; y < my + 28; y++) for (let x = mx - 22; x < mx + 22; x++) if (inM(x, y) && inE(x, y, cx, wy, wrx - 2, wry - 2)) b.set(x, y, y > my + 12 ? PAL.N2 : PAL.N1);
  for (const [dx, dy] of [[-2, -10], [-3, -11], [-4, -11], [-4, -12]] as Array<[number, number]>) b.set(mx + dx, my + dy, PAL.N1);
  // the crack, reflected: across the water from its left edge, whole pixels; `run` extra steps after the sky's has
  // stopped, until it runs across his small reflection and stops there
  const stopX = cx - 8, steps = [stopX, stopX + 14, stopX + 28, mx + 3];
  const endX = steps[st.run];
  let y = wy - 14;
  for (let x = cx - wrx + 3; x < endX; x++) {
    if (hash(x >> 2, 11, 73) < 0.4) y += hash(x, 13, 73) < 0.5 ? -1 : 1;
    y = clamp(y, wy - 20, wy - 4);
    if (x > mx - 26) y = Math.min(my - 2, y + 1);
    if (!inE(x, y, cx, wy, wrx - 2, wry - 2)) continue;
    b.set(x, y, PAL.N0); b.set(x, y - 1, PAL.W9);
  }
  void f;
};
void line; void ellipse; void text; void textWidth; void pw; void REG_BUST;
