// MR. MAS — Ep2 v1 art: DOT (NopeAI's front-desk contractor; manifest §2.2; sc 1, 14). naming.md: an ORANGE contractor
// lanyard in a building of teal ones; HER FACE IS NEVER SHOWN (it is first seen in Ep5, in the Orb's iris); nobody names
// her; no age, body or accent humour; never the butt. So: always from behind or her hands only.
//   drawDotLadder(b, x, y, pose)   from behind, up a ladder (x, y = the ladder's foot; the ladder is drawn with her):
//                                  pose 'reach' (both hands up at the sign: the plate swap), 'hold' (one hand on the
//                                  ladder, the other holding a spare 0 plate out), 'grip' (holding on as it sways: tilt
//                                  -1 | 0 | 1), 'point' (her cuffed hand pointing a screwdriver across the floor)
//   drawDotBack(b, x, y, legs)     standing from behind (the open floor's spread, far back)
//   dotHandsECU(b, k, screws)      the safety team's plate: her orange-cuffed hand backing out four screws (one per
//                                  beat: `screws` out 0..4), then the plate gone (screws 5)
//   dotPlateOut(b, x, y)           the spare `0` plate held out, from below (sc 1.12)
import {Buf, rect, line, ellipse} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {fill, sp, pt, pw, bpt, bpw, tiny, capsule, Sleeve, grip, HANDSKIN} from '../kit';
import {sheetPlate, label} from './sheet';
import {holdPhone, placeHand, drawHand, sleeve, skinDown, POSES} from './hands2';
import type {ArtAsset} from '../asset';

const NAVY: Sleeve = [PAL.N1, PAL.N2, PAL.N3, PAL.N5];
const ORANGE = [PAL.W3, PAL.W4, PAL.W5, PAL.W6];
const HAIR = [PAL.N0, PAL.B0, PAL.B1, PAL.B2];
const SK = HANDSKIN[1];
/** her figure from behind (local, 26 x 52): the back of her head (dark hair in a low bun), the orange lanyard's strap
 *  round the neck, a navy work jacket with orange cuffs, dark trousers */
const backFigure = (b: Buf, x: number, y: number, arms: 'reach' | 'hold' | 'grip' | 'point' | 'pointL' | 'down') => {
  // legs (from behind) on a rung
  fill(b, x + 7, y + 30, 5, 20, PAL.N1); fill(b, x + 13, y + 30, 5, 20, PAL.N1); fill(b, x + 8, y + 30, 1, 20, PAL.N2); fill(b, x + 14, y + 30, 1, 20, PAL.N2);
  fill(b, x + 6, y + 49, 6, 3, PAL.N0); fill(b, x + 13, y + 49, 6, 3, PAL.N0);
  // jacket body
  for (let j = 0; j < 22; j++) for (let i = 0; i < 18; i++) { const sh = j < 3 && (i < 2 || i > 15); if (sh) continue; b.set(x + 4 + i, y + 10 + j, i < 4 ? NAVY[1] : i > 13 ? NAVY[0] : NAVY[2]); }
  fill(b, x + 12, y + 14, 1, 16, NAVY[0]); // the back seam
  // the lanyard strap round the neck (orange), just visible at the collar
  fill(b, x + 8, y + 9, 10, 2, ORANGE[2]); b.set(x + 8, y + 11, ORANGE[1]); b.set(x + 17, y + 11, ORANGE[1]);
  // head from behind: hair, a low bun at the nape, the ears' edges
  for (let j = 0; j < 11; j++) for (let i = 0; i < 10; i++) { const d = Math.hypot((i - 4.5) / 5, (j - 5) / 5.5); if (d < 1) b.set(x + 8 + i, y - 2 + j, j < 3 ? HAIR[3] : i < 3 ? HAIR[2] : HAIR[1]); }
  ellipse(x + 13, y + 8, 3, 2, b.ink(HAIR[1])); b.set(x + 12, y + 7, HAIR[3]);
  b.set(x + 7, y + 4, SK[1]); b.set(x + 18, y + 4, SK[1]);
  // arms
  const cuffHand = (hx: number, hy: number) => { fill(b, hx - 2, hy, 5, 2, ORANGE[2]); fill(b, hx - 2, hy - 3, 5, 3, SK[2]); b.set(hx - 2, hy - 3, SK[3]); };
  if (arms === 'reach') { capsule(b, x + 6, y + 13, x + 2, y - 8, 2.6, NAVY); capsule(b, x + 20, y + 13, x + 24, y - 8, 2.6, NAVY); cuffHand(x + 2, y - 9); cuffHand(x + 24, y - 9); }
  else if (arms === 'hold') { capsule(b, x + 6, y + 13, x + 2, y + 24, 2.6, NAVY); capsule(b, x + 20, y + 13, x + 32, y + 6, 2.6, NAVY); cuffHand(x + 2, y + 24); cuffHand(x + 33, y + 5); fill(b, x + 31, y - 6, 8, 11, PAL.P2); fill(b, x + 33, y - 4, 4, 7, PAL.R2); fill(b, x + 34, y - 3, 2, 5, PAL.P2); }
  else if (arms === 'point') { capsule(b, x + 6, y + 13, x + 2, y + 24, 2.6, NAVY); capsule(b, x + 20, y + 13, x + 34, y + 10, 2.6, NAVY); cuffHand(x + 35, y + 9); line(x + 37, y + 8, x + 44, y + 6, b.ink(PAL.G5)); fill(b, x + 35, y + 8, 3, 2, PAL.W5); }
  else if (arms === 'pointL') { capsule(b, x + 20, y + 13, x + 24, y + 24, 2.6, NAVY); capsule(b, x + 6, y + 13, x - 8, y + 10, 2.6, NAVY); cuffHand(x - 9, y + 9); line(x - 11, y + 8, x - 18, y + 6, b.ink(PAL.G5)); fill(b, x - 11, y + 8, 3, 2, PAL.W5); }
  else if (arms === 'grip') { capsule(b, x + 6, y + 13, x + 1, y + 16, 2.6, NAVY); capsule(b, x + 20, y + 13, x + 25, y + 16, 2.6, NAVY); cuffHand(x + 1, y + 16); cuffHand(x + 25, y + 16); }
  else { capsule(b, x + 6, y + 13, x + 4, y + 28, 2.6, NAVY); capsule(b, x + 20, y + 13, x + 22, y + 28, 2.6, NAVY); cuffHand(x + 4, y + 29); cuffHand(x + 22, y + 29); }
};
/** the A-frame ladder and DOT up it, from behind; x, y = the ladder's foot centre; tilt sways the whole thing 1 px */
export const drawDotLadder = (b: Buf, x: number, y: number, pose: 'reach' | 'hold' | 'grip' | 'point' | 'pointL' = 'reach', tilt: -1 | 0 | 1 = 0) => {
  const top = y - 58;
  for (const [x0, x1] of [[x - 12, x - 4], [x + 12, x + 4]]) { line(x0, y, x1 + tilt, top, b.ink(PAL.G5)); line(x0 + (x0 < x ? 1 : -1), y, x1 + tilt + (x0 < x ? 1 : -1), top, b.ink(PAL.G3)); }
  for (let r = 1; r < 7; r++) { const yy = y - r * 8, hw = 12 - Math.round(r * 1.2); fill(b, x - hw + Math.round((tilt * r) / 7), yy, hw * 2 + 1, 1, PAL.G4); }
  fill(b, x - 5 + tilt, top - 2, 11, 3, PAL.G6);
  backFigure(b, x - 13 + tilt, y - 104, pose);
};
export const drawDotBack = (b: Buf, x: number, y: number) => backFigure(b, x - 13, y - 52, 'down');
/** the spare 0 plate held out from the ladder, from below (sc 1.12, [LOW]): her cuffed hand and the plate */
export const dotPlateOut = (b: Buf, x: number, y: number, k = 1) => {
  // her hand round the plate's lower corner (the thumb on its face, the fingers behind), the orange cuff, the navy
  // sleeve back down to the ladder (Ep1's insert-hands grammar); k = 2 for the low-angle MCU
  const r = {x: x - 10 * k, y: y - 30 * k, w: 22 * k, h: 30 * k};
  holdPhone(b, r, {side: 'R', grip: 'cup', light: 'lobby', widthCm: 12, thumbAt: -0.6, sleeveTo: [x + 44 * k, y + 44 * k],
    cuffRamp: [PAL.W2, PAL.W3, PAL.W3, PAL.W4, PAL.W5, PAL.W5, PAL.W6], sleeveRamp: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5], skinMap: skinDown(1),
    drawPhone: (bb) => { fill(bb, r.x, r.y, r.w, r.h, PAL.P2); fill(bb, r.x, r.y, r.w, k, PAL.W9); fill(bb, r.x + r.w - k, r.y, k, r.h, PAL.P0); bpt(bb, '0', r.x + Math.round((r.w - bpw('0')) / 2), r.y + Math.round(r.h / 2) - 7, PAL.R2); }});
};
/** [ECU] the safety team's door plate and her hand backing out its screws (sc 14.11): screws out 0..4, 5 = plate off */
export const dotHandsECU = (b: Buf, k: number, screws: number) => {
  // the door (pale wood) and the plate
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, (x + Math.floor(y / 3)) % 23 === 0 ? PAL.D3 : PAL.D4);
  if (screws < 5) {
    fill(b, 120, 60, 240, 84, PAL.G5); fill(b, 120, 60, 240, 2, PAL.G6); fill(b, 358, 60, 2, 84, PAL.G3); fill(b, 120, 142, 240, 2, PAL.G3);
    const t1 = 'SUPERALIGNMENT', t2 = 'SAFETY TEAM';
    bpt(b, t1, 240 - Math.round(bpw(t1) / 2), 82, PAL.N1); bpt(b, t2, 240 - Math.round(bpw(t2) / 2), 108, PAL.N2);
    const holes: Array<[number, number]> = [[132, 70], [346, 70], [132, 132], [346, 132]];
    holes.forEach(([hx, hy], i) => {
      if (i < screws) { b.set(hx, hy, PAL.N0); b.set(hx + 1, hy, PAL.N0); return; }
      ellipse(hx, hy, 4, 4, b.ink(PAL.G6)); line(hx - 3, hy, hx + 3, hy, b.ink(PAL.G3));
    });
    // her hand on the screwdriver at the next screw: the shaft from the screw head out and down, away from the plate's
    // words, the handle in her fist (the thumb along it), the wrist into the orange cuff and the navy sleeve out of
    // frame (Ep1's insert-hands grammar; the left screws with her left hand, the right ones with her right)
    if (screws < 4) {
      const [hx, hy] = holes[screws];
      const turn = Math.floor(k / 3) % 2;
      const sd = hx < 240 ? -1 : 1;
      // (the tool out to the side and a little down, sized so the handle and her fist stay in frame)
      const ax = sd * 0.85, ay = 0.5;
      const s9 = 6;
      const shaftEnd: [number, number] = [hx + ax * 7 * s9, hy + ay * 7 * s9];
      for (let t = 0; t <= 7 * s9; t++) { const px = Math.round(hx + ax * t), py = Math.round(hy + ay * t); b.set(px, py, PAL.G5); b.set(px + 1, py, PAL.G6); b.set(px - 1, py, PAL.G3); }
      // the handle (amber resin, ridged), under her fingers
      for (let t = 0; t <= 10 * s9; t++) for (let w = -9; w <= 9; w++) { const px = Math.round(shaftEnd[0] + ax * t - ay * w * 0.9), py = Math.round(shaftEnd[1] + ay * t + ax * w * 0.9); b.set(px, py, Math.abs(w) > 7 ? PAL.W3 : w < -3 ? PAL.W6 : (t + turn * 3) % 6 < 2 ? PAL.W4 : PAL.W5); }
      const wrist: [number, number] = [shaftEnd[0] + ax * 11 * s9, shaftEnd[1] + ay * 11 * s9];
      const h = placeHand(POSES.grip([-ax, -ay, 0.05], [-sd * 0.25, -0.2, 0.95], sd < 0 ? 'L' : 'R', 0.82), {s: s9, at: wrist, anchor: 'wrist', light: 'lobby', skinMap: skinDown(1),
        cuffRamp: [PAL.W2, PAL.W3, PAL.W3, PAL.W4, PAL.W5, PAL.W5, PAL.W6]});
      sleeve(b, h.cuffEnd, [h.cuffEnd[0] + ax * 160, h.cuffEnd[1] + ay * 160], 26, 30, [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5]);
      drawHand(b, h.hand, h.x, h.y);
    }
  } else {
    // the clean patch where the plate was, four holes
    fill(b, 120, 60, 240, 84, PAL.D4); fill(b, 120, 60, 240, 1, PAL.W3);
    for (const [hx, hy] of [[132, 70], [346, 70], [132, 132], [346, 132]]) { b.set(hx, hy, PAL.N0); b.set(hx + 1, hy, PAL.N0); }
  }
};

export const ART: ArtAsset[] = [{
  id: 'char-dot', manifest: '§2.2 DOT', kind: 'character', name: 'DOT (front-desk contractor; never her face)',
  file: 'cast/dot.ts', exports: 'drawDotLadder, drawDotBack, dotPlateOut, dotHandsECU', scenes: '1, 14',
  note: 'from behind only: navy work jacket, orange lanyard strap and orange cuffs, a low bun; up the ladder; her hands at the screws',
  stills: [
    {label: 'from behind up the ladder: reach (the plate swap) · hold (the spare 0) · grip (the sway) · point (the screwdriver); standing', draw: (b) => {
      sheetPlate(b, [PAL.G1, PAL.G2, PAL.G3, PAL.G3]);
      drawDotLadder(b, 60, 186, 'reach'); label(b, 'reach', 60, 192);
      drawDotLadder(b, 150, 186, 'hold'); label(b, 'hold 0', 150, 192);
      drawDotLadder(b, 250, 186, 'grip', 1); label(b, 'grip (sway)', 250, 192);
      drawDotLadder(b, 340, 186, 'point'); label(b, 'point', 340, 192);
      drawDotBack(b, 440, 186); label(b, 'standing', 440, 192);
    }},
    {label: '[ECU] sc 14.11: her orange-cuffed hand backs out the four screws, one per beat (2 of 4 out)', draw: (b) => dotHandsECU(b, 0, 2)},
  ],
}];
void rect; void stepColor; void sp; void pt; void tiny;
