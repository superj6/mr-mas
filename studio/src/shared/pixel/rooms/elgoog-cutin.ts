// MR. MAS — shared set: 8.04's CUT-IN ON THE FOUNDERS (script draft 8.1, §10.7: "one cut-in on the founders for
// 'Someone else built that?'"). New file (v3-art-a, v3.2 round, 2026-09-28). Still on Mas's phone (the chrome), closer:
// NIRB and EGAP at the top of the crypt steps at 3x (cast/elgoog-founders.ts founderCutIn: their own geometry
// re-rastered, backlit, no faces), peering at Radnus's phone held in from frame left, the two-dot bubble on it. Behind
// them the atrium's glass wall and a primary panel, flat and bright; the siren's red passes over on its turn.
//   drawFoundersCutIn(b, f, st)   st.egap 'mug' (default: both hands on RETIRED 2019) · 'reach'; st.nirb 'shade' ·
//                                 'reach' (default: leaning in, pointing); st.turning (the sweep); st.chrome (default on)
import {Buf, rect, bayer} from '../px';
import {PAL, lightness} from '../palette';
import {drawFounderCutIn, FOUNDER_DEFAULT, FounderPose} from '../cast/elgoog-founders';
import {sirenBeamAt} from './elgoog-lobby';

const RH = 203;
export interface FoundersCutInState { nirb?: FounderPose['arm']; egap?: FounderPose['arm']; turning?: boolean; chrome?: boolean }
export const drawFoundersCutIn = (b: Buf, f: number, st: FoundersCutInState = {}) => {
  // the glass curtain wall, closer: the day outside in three bands, fat mullions, the mezzanine rail
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const t = y / 120 + (bayer(x, y) - 0.5) * 0.15; b.set(x, y, t < 0.35 ? PAL.P1 : t < 0.7 ? PAL.G6 : PAL.G5); }
  for (let x = 30; x < 480; x += 96) rect(x, 0, 8, RH, b.ink(PAL.G4));
  rect(0, 70, 480, 10, b.ink(PAL.G4)); rect(0, 70, 480, 2, b.ink(PAL.P1));
  // a primary panel (red) behind EGAP, a green one at the left
  rect(392, 0, 40, RH, b.ink(PAL.R2)); rect(392, 0, 3, RH, b.ink(PAL.R3));
  rect(0, 0, 26, RH, b.ink(PAL.L2)); rect(24, 0, 2, RH, b.ink(PAL.L1));
  // the crypt's stone lip at the bottom (they've just reached the top step)
  rect(60, 176, 360, RH - 176, b.ink(PAL.G2)); rect(60, 176, 360, 2, b.ink(PAL.G4));
  // the two founders, 3x, backlit (half-lit: they're up in the lobby's day now)
  drawFounderCutIn(b, 'nirb', 96, 8, {...FOUNDER_DEFAULT, arm: st.nirb ?? 'reach', lit: 1});
  drawFounderCutIn(b, 'egap', 250, 6, {...FOUNDER_DEFAULT, arm: st.egap ?? 'mug', lit: 1});
  // Radnus's phone held in from frame left, the chat bubble with two dot eyes on its screen (what they're looking at)
  for (let y = 120; y < 150; y++) for (let x = 0; x < 44 + Math.round((y - 120) * 0.3); x++) b.set(x, y, y < 122 ? PAL.N6 : bayer(x, y) < 0.3 ? PAL.N5 : PAL.N4);
  rect(40, 110, 12, 18, b.ink(PAL.S4)); rect(40, 110, 12, 2, b.ink(PAL.S5));
  rect(44, 84, 22, 38, b.ink(PAL.N0)); rect(46, 87, 18, 30, b.ink(PAL.C2));
  rect(48, 95, 14, 10, b.ink(PAL.P2)); rect(48, 105, 3, 2, b.ink(PAL.P2));
  b.set(52, 99, PAL.N0); b.set(58, 99, PAL.N0);
  // the siren's red passing over on its turn (a band of the sweep, stepping across in its beams)
  if (st.turning) {
    const beam = sirenBeamAt(f);
    if (beam >= 2 && beam <= 5) {
      const x0 = Math.round(((beam - 2) / 4) * 480) - 60;
      for (let y = 0; y < RH; y++) for (let x = x0; x < x0 + 140; x++) { if (x < 0 || x >= 480) continue; const soft = x < x0 + 20 || x > x0 + 120; if (soft && bayer(x, y) > 0.5) continue; const L = lightness(b.get(x, y)); b.set(x, y, L > 0.62 ? PAL.W7 : L > 0.45 ? PAL.R3 : L > 0.28 ? PAL.R2 : L > 0.14 ? PAL.R1 : PAL.R0); }
    }
  }
  if (st.chrome ?? true) {
    rect(0, 0, 480, 7, b.ink(PAL.N0));
    for (let i = 0; i < 4; i++) rect(8 + i * 3, 4 - i, 2, 1 + i, b.ink(PAL.G5));
    rect(452, 2, 18, 4, b.ink(PAL.G5)); rect(453, 3, 12, 2, b.ink(PAL.L2)); rect(470, 3, 1, 2, b.ink(PAL.G5));
    for (const [cx0, cy0, sx, sy] of [[0, 0, 1, 1], [479, 0, -1, 1], [0, RH - 1, 1, -1], [479, RH - 1, -1, -1]] as Array<[number, number, number, number]>)
      for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) if (Math.hypot(5.5 - i, 5.5 - j) > 5.5) b.set(cx0 + i * sx, cy0 + j * sy, PAL.N0);
  }
};
