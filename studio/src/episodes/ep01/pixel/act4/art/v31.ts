// MR. MAS — Ep1 v3.1 · Act Four art (the v3-shots-act4 pass, v3.1 round; NEW, additive, opt-in). The pieces of script
// draft 7's Act Four that the v3-art-b pass's kits/act4-v31.ts leaves to the shot pass, drawn over the show's existing
// drawings, never by editing them:
//   drawWindowTwoShot(fb, k, o)   v31-S1.01b [2S] Mas and the Orb at the suite's window, a practice lap below: the suite's
//                                 own back layer (rooms/vegas-suite suiteLayers: the Strip, the circuit, the stands),
//                                 race-dressed (art/race), one step soft; a generic race car (no livery: a plain body,
//                                 a white number disc with no number, never a real series' car) on the near straight in
//                                 whole-pixel steps; MAS's bust at the left third turned to the Orb (masPortrait,
//                                 flipped: the body faces frame right), the Orb at the right third its iris on the car
//                                 (orbLook), holding where it lost the car, snapping back when it finds it again
//   wifiBars(b, n)                the call app's hotel Wi-Fi, n of 4 bars lit (shots.ts wifi() is the 1-bar egg)
//   planChairV3(fb, oy)           S1.03: GERG's plate reads CHAIR (plan4.ts letters CO-FOUNDER): the plate's box
//                                 re-drawn from the same tall sheet (bpSheet 480 x 330, the tilt `oy`), through the same
//                                 ink, with CHAIR in plan4's own call (bpText, centred, hot)
//   alyiTileLit(b, t, f, o)       S1.07 / S1.09: ALYI's call tile on HIS side drawn lit in his doorway, the board side's
//                                 drawing (cast/alyi-v5 drawAlyiTileFit {lit}), with a full viseme mouth, so his first
//                                 sentence is seen spoken (v5's his-side tile is his reflection in glass, its mouth hidden
//                                 under the glass's bar); the tile's frame, name chip, vote chip and speaking ring as
//                                 callgrid drawTile draws them
//   firstTileStrip(fb, T)         S6.01: the letter's header strip (kits/act4-v31 letterHeaderStrip) on the avalanche's
//                                 first employee tile as it lands, only where the grid's panel still shows (the pour
//                                 buries it)
import {Buf, rect, bayer} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {BPX, bpSheet, bpText, bpTextWidth, inkBlueprint} from '../../../../../shared/pixel/kits/blueprint';
import {suiteLayers, SUITE} from '../../../../../shared/pixel/rooms/vegas-suite';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasMouth} from '../../../../../shared/pixel/cast/mas';
import {drawOrb, orbLook} from '../../../../../shared/pixel/cast/orb-medium';
import {gridItemY} from '../../../../../shared/pixel/kits/avalanche';
import {drawTile, nameChip, voteChip, speakingRing} from '../../../../../shared/pixel/kits/callgrid';
import type {TileRect} from '../../../../../shared/pixel/kits/callgrid';
import {drawAlyiTileFit} from '../../../../../shared/pixel/cast/alyi-v5';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {letterHeaderStrip} from '../../../../../shared/pixel/kits/act4-v31';
import {tinyWidth} from '../../../../../shared/pixel/rooms/kit-b';
import {drawBust, soft, vignette} from '../../../act4/animatic/framing';
import {stackPlan, STACK, SLOT, LIFT} from '../../../act4/animatic/shots';
import {suiteRaceDressing} from './race';

const RH = 203;

// ------------------------------------------------------------------ v31-S1.01b: the window two-shot
const W = SUITE.WINDOW;
/** the car's pass on the near straight: frames [k0, k1) from x0 to x1 (the nose), whole px */
export const CAR_PASSES: Array<[number, number]> = [[4, 26], [50, 72]];
const CAR_Y = 134; // its wheels' row on the street (SUITE.STREET_Y + 2)
const carX = (k: number): number | null => {
  for (const [a, z] of CAR_PASSES) if (k >= a && k < z) return Math.round(W.x0 - 10 + ((k - a) * (W.x1 - W.x0 + 24)) / (z - a));
  return null;
};
/** a generic open-wheel race car in profile, facing right, 18 x 6: a plain red body, a pale driver's helmet, a white
 *  number disc with no number; nose at x */
const drawCar = (b: Buf, nose: number, y: number, clip: (x: number, y: number) => boolean) => {
  const put = (x: number, yy: number, c: number) => { if (clip(x, yy)) b.set(x, yy, c); };
  const x0 = nose - 18;
  for (let i = 0; i < 18; i++) { put(x0 + i, y - 3, i < 3 || i > 15 ? PAL.R1 : PAL.R3); if (i > 2 && i < 16) put(x0 + i, y - 4, i === 9 ? PAL.P2 : PAL.R2); }
  for (let i = 7; i < 11; i++) put(x0 + i, y - 5, i === 8 ? PAL.P2 : PAL.P1); // the helmet
  put(x0 + 12, y - 4, PAL.P2); put(x0 + 13, y - 4, PAL.P2); // the number disc (no number)
  for (let i = 0; i < 2; i++) put(x0 + 16 + i, y - 2, PAL.R1); // the front wing
  put(x0, y - 5, PAL.R1); put(x0, y - 4, PAL.R1); // the rear wing
  for (const wx of [2, 13]) { for (let i = 0; i < 4; i++) { put(x0 + wx + i, y - 2, PAL.N0); put(x0 + wx + i, y - 1, PAL.N0); } put(x0 + wx + 1, y - 2, PAL.G3); }
};
export interface WindowTwoShotOpts { mouth?: MasMouth; lid?: 0 | 1 | 2 }
/** the Orb's place in the two-shot and where it looks: the car, or where it lost it, or back at the start of the straight */
export const W2S_ORB = {x: 318, y: 70, r: 14};
export const drawWindowTwoShot = (fb: Buf, k: number, o: WindowTwoShotOpts = {}) => {
  // the suite's back layer (its view, walls, drapes, minibar) at the shot's clock, race-dressed, the car on the street
  const L = suiteLayers({f: k, laptop: 1, truckX: null});
  const bg = new Buf(480, 270, PAL.N0); bg.c.set(L.back.c.subarray(0, 480 * RH));
  suiteRaceDressing(bg, k, {truckX: null});
  const cx = carX(k);
  const mull = new Set<number>(SUITE.MULLIONS.flatMap((m) => [m, m + 1]));
  const inView = (x: number, y: number) => x >= W.x0 && x <= W.x1 && y >= W.y0 && y <= W.y1 && !mull.has(x);
  if (cx !== null) drawCar(bg, cx, CAR_Y, inView);
  soft(bg, 1); vignette(bg, 160, 1);
  fb.c.set(bg.c.subarray(0, 480 * RH), 0);
  // MAS at the left third, turned to the Orb (the bust flipped: he faces frame right; look -1 = toward it)
  drawBust(fb, masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, light: 'warm', mouth: o.mouth ?? 'rest', lid: o.lid ?? 0}), {third: 'L', dx: -20, flip: true});
  // the Orb in front of the glass, its iris on the car; losing it (the car gone behind the drape) it holds, then finds
  // the next pass at the straight's start
  const {x, y, r} = W2S_ORB;
  let tx: number, ty = CAR_Y - 3;
  if (cx !== null) tx = Math.min(W.x1, cx - 9);
  else { const next = CAR_PASSES.find(([a]) => a > k); tx = next && k >= next[0] - 6 ? W.x0 + 6 : W.x1; }
  drawOrb(fb, x, y, r, {look: orbLook(x, y, tx, ty, 60), aperture: 0.55});
};

// ------------------------------------------------------------------ ALYI's tile, lit, speaking (his side)
export const alyiTileLit = (b: Buf, t: TileRect, f: number, o: {mouth?: Viseme; speaking?: boolean; open?: number; frozenAt?: number} = {}) => {
  if (o.open !== undefined && o.open < 6) { drawTile(b, {...t, id: 'alyi', name: 'ALYI', open: o.open}, f); return; }
  rect(t.x - 1, t.y - 1, t.w + 2, t.h + 2, b.ink(PAL.N0));
  rect(t.x - 2, t.y - 2, t.w + 4, 1, b.ink(PAL.N2));
  drawAlyiTileFit(b, t.x, t.y, t.w, t.h, {mouth: o.mouth ?? 'rest', eyes: 'open', t: o.frozenAt ?? f}, {lit: true});
  nameChip(b, t.x + 2, t.y + t.h - 13, 'ALYI');
  voteChip(b, t.x + t.w - 12, t.y + 3, 3);
  if (o.speaking) speakingRing(b, t);
};

// ------------------------------------------------------------------ the call app's Wi-Fi, n bars of 4
export const wifiBars = (b: Buf, n: number) => {
  for (let i = 0; i < 4; i++) rect(454 + i * 4, 9 - (i + 1) * 2, 3, (i + 1) * 2, b.ink(i < n ? PAL.P1 : PAL.N3));
};

// ------------------------------------------------------------------ S1.03: GERG / CHAIR
const CX4 = 240, FOOT = 150; // plan4 PLAN4.CX[4], PLAN4.FOOT (GERG's plate on the tall sheet)
let CHAIR_TALL: Buf | null = null;
/** the tall sheet under GERG's second plate line, with CHAIR lettered there, inked (the patch) */
const chairPatch = () => (CHAIR_TALL ??= (() => {
  const b = new Buf(480, 330, BPX.navy); bpSheet(b);
  bpText(b, 'CHAIR', CX4, FOOT + 15, 999, 0, {align: 'center', col: BPX.hot});
  inkBlueprint(b);
  return b;
})());
/** the box plan4 letters CO-FOUNDER in (tall-sheet coords) */
export const chairBox = (): [number, number, number, number] => { const w = bpTextWidth('CO-FOUNDER'); return [CX4 - Math.ceil(w / 2) - 2, FOOT + 14, w + 6, 9]; };
/** after drawPlan4 drew S1.03 (the tall sheet at tilt oy, full frame): CO-FOUNDER -> CHAIR */
export const planChairV3 = (fb: Buf, oy: number) => {
  const P = chairPatch(), [x0, y0, w, h] = chairBox();
  for (let y = y0; y < y0 + h; y++) { const Y = y - oy; if (Y < 0 || Y >= 270) continue; for (let x = x0; x < x0 + w; x++) fb.c[Y * 480 + x] = P.c[y * 480 + x]; }
};

// ------------------------------------------------------------------ S6.01: the letter on the first tile to land
/** T = the avalanche's clock (shots4 avalanche4's T); draws the strip over the first employee tile from its spawn,
 *  following it down, and lets later tiles bury it (it paints only where the grid's own N1 panel still shows) */
export const firstTileStrip = (fb: Buf, T: number) => {
  const it = stackPlan()[0];
  const y = gridItemY(it, T, SLOT);
  if (y === null) return;
  const Y = y - LIFT; // the stack's buffer is shown from row LIFT
  // as wide as the full header where the grid is free, else the kit's short form (the board's tiles sit at column 6)
  const x = Math.max(2, it.x), free = (it.x < 75 ? 74 : 480) - x;
  const w = Math.min(tinyWidth('STAFF LETTER · TO THE BOARD') + 4, free);
  const t = new Buf(480, 270, 0x1000000);
  letterHeaderStrip(t, x, Y - 11, w);
  // a tab from the strip to its tile, so the header reads as the tile's own
  rect(it.x + 3, Y - 2, 5, 2, t.ink(PAL.P2));
  for (let j = Math.max(0, Y - 11); j < Math.min(RH, Y); j++) for (let i = x; i < x + w; i++) {
    const c = t.c[j * 480 + i];
    if (c === 0x1000000) continue;
    if (fb.c[j * 480 + i] !== PAL.N1) continue; // under a landed tile: buried
    fb.c[j * 480 + i] = c;
  }
  void STACK; void bayer; void stepColor;
};
