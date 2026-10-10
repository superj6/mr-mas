// MR. MAS — Ep2 v1 · act4 · ELPPA'S CAMPUS (sc 19 JUN 10; sc 20's left pane that afternoon). The shots pass, 2026-10-09.
// The set is the art pass's (art/sets/elppa campus: generic pavilions, the lawn, the giant outdoor screen on its truss,
// the crowd's backs; no real building, logo or trade dress); this file stages Mas in it and adds the close shots:
//   lawn(b, f, st)         [W] 19.07 / 19.08: the crowd's backs under the giant screen, ELPPA still on its stage; Mas at
//                          the crowd's edge (st.mas: walking up head down over his phone, then standing, typing; three
//                          collars, no pop, no badge); the stream's chat lighting with his post (st.chat); phones
//                          buzzing across the lawn (st.buzz)
//   masLawn(b, f, st)      [MCU] 19.08-19.10: Mas on the lawn (his approved portrait in the noon light, keyed one step),
//                          the giant screen soft behind him; his phone in his hand (`phone` 'hand'), at his ear ('ear'),
//                          lip-synced on the call
//   thinning(b, f, st)     [W] 20.01 (the split's left pane): the crowd thinning, the giant screen's end card; Mas
//                          pockets his phone and walks out past it
//   phonePush(b, f, st)    [POV] 19.11: a push from his face into his phone: the stream's stage full-bleed, the GPS
//                          breadcrumb (in older colours) drawing itself across the boards he once stood on
import {Buf, rect, line, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {campus, keynotePainter, breadcrumb} from '../../art/sets/elppa';
import {drawMasStand2} from '../../art/cast/mas2';
import type {Mas2Legs, Mas2Arm} from '../../art/cast/mas2';
import {placeHand, drawHand, sleeve, holdPhone, POSES, skinDown} from '../../art/cast/hands2';
import {fill, pt, tiny, vramp} from '../../art/kit';
import {RH, W, glow, putBustSoft} from './common';

// ================================================================== the lawn, wide
export interface LawnSt {
  /** Mas: his foot x, walking (legs) or standing, typing over his phone (arm 'phone', head bowed), or pocketing it */
  mas?: {x: number; legs?: Mas2Legs; arm?: Mas2Arm; bow?: boolean} | null;
  chat?: number;
  buzz?: boolean;
  thin?: number;
  endcard?: boolean;
}
export const MAS_EDGE = 76;
export const lawn = (b: Buf, f: number, st: LawnSt = {}) => {
  campus(b, f, {chat: st.chat, buzz: st.buzz, thin: st.thin, endcard: st.endcard}, (bb) => {
    const m = st.mas;
    if (!m) return;
    // his shadow on the grass, then him (the art's stand rig: the grey hoodie, three collars, no pop, no badge)
    for (let i = -12; i <= 12; i++) for (let j = -1; j <= 1; j++) if (Math.abs(i) / 12 + Math.abs(j) / 1.5 < 1 && bayer(m.x + i, 196 + j) < 0.6) bb.set(m.x + i, 196 + j, stepColor(bb.get(m.x + i, 196 + j), -1));
    drawMasStand2(bb, m.x, 196, {arm: m.arm ?? 'phone', legs: m.legs ?? 'stand', bow: m.bow ?? true, light: 'room'});
  });
};

// ================================================================== Mas on the lawn, close
/** the campus behind a close shot: the sky, the pavilions, the giant screen soft and big at frame right (the keynote's
 *  stage on it), the crowd's heads below; two rungs down. Cached */
let SOFT: Buf | null = null;
const lawnSoft = () => {
  if (SOFT) return SOFT;
  const t = new Buf(W, 270, PAL.N0);
  campus(t, 0, {});
  const b = new Buf(W, RH, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(t.get(clamp(Math.round(150 + x * 0.6), 0, W - 1), clamp(Math.round(10 + y * 0.6), 0, RH - 1)), -1));
  SOFT = b;
  return b;
};
const MASL = new Map<string, ReturnType<typeof masPortrait>>();
/** his approved portrait in the noon light outdoors (the warm rig, keyed a step from the sun at camera-right) */
export const masNoonImg = (s: Partial<MasPortraitState>) => {
  const key = JSON.stringify(s); const hit = MASL.get(key); if (hit) return hit;
  const out = faceLightImg(masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', ...s}), 1, {key: [1, -0.4]});
  MASL.set(key, out);
  return out;
};
const CUFF = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3, PAL.G5], SLV = [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5];
export const masLawn = (b: Buf, f: number, st: {mouth?: MasPortraitState['mouth']; phone?: 'hand' | 'ear' | null; buzz?: boolean; look?: -1 | 0 | 1}) => {
  b.c.set(lawnSoft().c.subarray(0, W * RH));
  const X = 118, Y = 28;
  putBustSoft(b, masNoonImg({mouth: st.mouth ?? 'rest', look: st.look ?? -1}), X, Y, RH);
  if (st.phone === 'ear') {
    // the phone pressed to his ear (the portrait's visible ear at its right), his hand round its back, the sleeve down
    const ex = X + 80, ey = Y + 50;
    fill(b, ex - 3, ey - 18, 10, 40, PAL.N0); fill(b, ex - 2, ey - 17, 2, 38, PAL.G3);
    const h = placeHand(POSES.grip([0.1, -1, 0.1], [0.95, 0, 0.3], 'L', 0.55), {s: 2.6, at: [ex + 4, ey + 6], anchor: 'middle', light: 'lobby', cuffRamp: CUFF});
    sleeve(b, h.cuffEnd, [ex + 30, RH + 40], 9, 13, SLV);
    drawHand(b, h.hand, h.x, h.y);
  } else if (st.phone === 'hand') {
    // his phone low in his hand at his chest (it buzzes: a pixel of shake), its screen lit
    const sh = st.buzz && Math.floor(f / 2) % 2 ? 1 : 0;
    const R = {x: X + 74 + sh, y: Y + 128, w: 32, h: 56};
    holdPhone(b, R, {side: 'R', grip: 'wrap', light: 'lobby', widthCm: 7, thumbAt: 0.45, sleeveTo: [X + 160, RH + 60], cuffRamp: CUFF, sleeveRamp: SLV,
      drawPhone: (bb) => { fill(bb, R.x, R.y, R.w, R.h, PAL.N0); fill(bb, R.x + 2, R.y + 3, R.w - 4, R.h - 6, st.buzz ? PAL.L2 : PAL.N3); if (st.buzz) tiny(bb, 'GERG', R.x + 5, R.y + 12, PAL.P2); }});
  }
  void f;
};

// ================================================================== sc 20: the crowd thinning
export const thinning = (b: Buf, f: number, st: {thin: number; endcard?: boolean; mas?: {x: number; legs?: Mas2Legs; arm?: Mas2Arm} | null}) => {
  lawn(b, f, {thin: st.thin, endcard: st.endcard, mas: st.mas ? {x: st.mas.x, legs: st.mas.legs, arm: st.mas.arm ?? 'down', bow: false} : null});
};

// ================================================================== 19.11: into his phone
/** [POV] his phone in his hand (its screen the stream's stage) pushed in to full-bleed in held steps (`push` 0..3); the
 *  breadcrumb drawing itself across the stage (`crumb` frames since it started) in 2008's colours */
export const phonePush = (b: Buf, f: number, st: {push: number; crumb: number}) => {
  const stage = new Buf(W, 270, PAL.N0);
  keynotePainter(stage, {x: 0, y: 0, w: W, h: RH}, {slide: 'stage', f});
  fill(stage, 8, 8, 30, 11, PAL.R2); tiny(stage, 'LIVE', 12, 11, PAL.P2);
  if (st.crumb >= 0) breadcrumb(stage, st.crumb);
  const p = clamp(st.push, 0, 3);
  if (p >= 3) { b.c.set(stage.c.subarray(0, W * RH)); return; }
  b.c.set(lawnSoft().c.subarray(0, W * RH));
  const sizes = [[90, 160], [200, 190], [330, 200]];
  const [w, h] = sizes[p], x0 = Math.round(240 - w / 2), y0 = Math.round(101 - h / 2) + (p === 0 ? 20 : 0);
  fill(b, x0 - 5, y0 - 8, w + 10, h + 16, PAL.N0);
  // the stage letterboxed in the phone's portrait screen (its picture centred), at the push's size
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const sx = Math.floor(((i - w / 2) * W) / Math.max(w, (h * W) / RH) + W / 2), sy = Math.floor((j * RH) / h);
    b.set(x0 + i, y0 + j, sx >= 0 && sx < W ? stage.c[sy * W + sx] : PAL.N1);
  }
  void f;
};
void rect; void line; void ellipse; void hash; void pt; void vramp; void glow; void skinDown;
