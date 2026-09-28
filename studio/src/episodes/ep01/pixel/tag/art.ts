// MR. MAS — Ep1 v3 pixel shots, THE TAG's own small drawings (the v3-shots-coldopen-tag pass, 2026-09-27). New, additive,
// namespaced to the segment: nothing in shared/pixel is edited; v3-art-b's dark-room pieces are only imported.
//   drawCoverProfile(b, f, st)   32.05 [MCU·PF] "close.": the tag's profile set-up (the one rooms/darkroom-act3.ts
//                                drawProfileGlass builds for 33.04: the room four rungs down, his portrait right of centre
//                                turned to camera-left) with EMIT's cover held up at frame left in place of the glass, so
//                                "close." and "noted." play in one set-up and rhyme. The hand is darkroom-act3's
//                                fingertips drawing (not exported there), re-set here
//   drawWallOrb(b, f, look)      32.07: the Orb beside him at the back wall in the wide (drawBackWall draws it at the
//                                desk), bobbing, its iris on the cover
import {Buf, rect} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {drawDarkPlate, drawDarkPlateDesk} from '../../../../shared/pixel/rooms/darkroom-plate';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {putBustCut} from '../../../../shared/pixel/cast/civic-kit';
import {drawEmitCover} from '../../../../shared/pixel/kits/emit-cover';
import {drawOrb, orbBob} from '../../../../shared/pixel/cast/orb-medium';

const RH = 203;

/** darkroom-act3's fingertips: n rounded tips with pale nails over the back of one hand, lit on their left edges */
const fingertips = (b: Buf, x: number, y: number, n: number, w = 11, gap = 2, bottom = RH) => {
  const hw = n * (w + gap), px = x - 2, py = y + w + 8;
  for (let yy = py; yy < bottom; yy++) for (let xx = px; xx < px + hw + 4; xx++) { const t = (xx - px) / (hw + 4); if (Math.hypot((t - 0.5) * 2, Math.max(0, py + 10 - yy) / 10) <= 1) b.set(xx, yy, t < 0.15 ? PAL.K3 : t > 0.85 ? PAL.X1 : PAL.K2); }
  for (let k = 0; k < n; k++) {
    const fx = x + k * (w + gap), fy = y + [4, 0, 1, 5][k % 4];
    const r = w / 2;
    for (let yy = fy; yy < bottom; yy++) for (let xx = fx; xx < fx + w; xx++) {
      const inTip = yy >= fy + r || Math.hypot(xx + 0.5 - fx - r, yy + 0.5 - fy - r) <= r;
      if (!inTip) continue;
      const edgeL = xx === fx || (yy < fy + r && Math.hypot(xx - 0.5 - fx - r, yy + 0.5 - fy - r) > r);
      b.set(xx, yy, edgeL ? PAL.K4 : xx >= fx + w - 2 ? PAL.X1 : yy < fy + 3 ? PAL.K3 : PAL.K2);
    }
    rect(fx + 2, fy + 2, w - 5, 3, b.ink(PAL.K4)); b.set(fx + 2, fy + 2, PAL.C8);
  }
};

export const COVER_PF = {x: 96, y: 30};
export const drawCoverProfile = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>} = {}) => {
  // the room fallen away (drawProfileGlass's: the plate and its desk, four rungs down)
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, f, {tally: 3}); drawDarkPlateDesk(bg, f, {tally: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(bg.get(x, y), -4));
  // his portrait right of centre, turned to camera-left: to the cover
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, ...st.mas}), 238, 20, RH);
  // the cover held up at frame left, a little below his eyeline (he looks down at it); his hand at its lower edge, the
  // sleeve running out of the frame's foot toward him
  const {x, y} = COVER_PF;
  drawEmitCover(b, x, y, 'mcu');
  fingertips(b, x + 60, y + 131, 3, 10, 2, y + 148);
  for (let yy = y + 148; yy < RH; yy++) for (let xx = x + 56; xx < x + 102; xx++) b.set(xx, yy, xx < x + 62 ? PAL.C3 : xx > x + 96 ? PAL.N1 : PAL.G1);
};

/** 33.04: drawProfileGlass without its resting hand (an oval that reads as a pale block beside the glass at this size):
 *  the fallen-away room is painted back over the hand and its sleeve, so the frame is his face and the glass */
export const eraseProfileHand = (b: Buf, f: number) => {
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, f, {tally: 3}); drawDarkPlateDesk(bg, f, {tally: 3});
  for (let y = 156; y < 176; y++) for (let x = 158; x < 238; x++) b.set(x, y, stepColor(bg.get(x, y), -4));
  for (let y = 176; y < 180; y++) for (let x = 158; x < 238; x++) b.set(x, y, y === 176 ? PAL.C3 : PAL.D2);
};

/** the Orb beside him at the back wall (the dark room's wide, r 6), its iris on the wall */
export const WALL_ORB: [number, number] = [178, 92];
export const drawWallOrb = (b: Buf, f: number, look: [number, number], dx = 0) => {
  drawOrb(b, WALL_ORB[0] + dx, WALL_ORB[1] + orbBob(f), 6, {look, aperture: 0.5, monitor: -1});
};

