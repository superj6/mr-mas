// MR. MAS — mcoldopen: the cold open as ONE PixelScene definition (pure; shared by Remotion and the Node
// preview). Frame numbers are GLOBAL intro frames (see timeline.ts; the span starts at 0).
//   macro9 f0-14 -> macro3 f15-29 -> medium f30-44 -> wide f45-59 -> medium f60-98
//   -> wide + GLYPH scan f99-104 -> medium f105-117 (smile, Post, token chips) -> white f118-119
import {Buf, W, H, line} from '../../shared/pixel/px';
import {bayer4} from '../../shared/pixel/dither';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {Mask, coneMask} from '../../shared/pixel/mask';
import {remap} from '../../shared/pixel/palettes';
import type {GlyphStyle} from '../../shared/pixel/glyph';
import type {PixelSceneProps} from '../../shared/pixel/compose';
import {masDeskFront} from '../../shared/pixel/cast/mas';
import {shotAt, EV} from './timeline';
import {screenAt, CARET_HOME} from './screen';
import {drawMacro} from './macro';
import {drawMedium, CARET_FRAME} from './medium';
import {drawWide, masDeskAt, WIDE} from './wide';
import {drawCathedral} from './cathedral';
import {drawChips} from './chips';
import {orbBob} from './orb';
import {vignette} from './paint';

export type SceneDef = Pick<PixelSceneProps, 'draw' | 'after' | 'palette' | 'switch'>;

// ------------------------------------------------------------------ the scan (f99-104)
/** per-frame fan: [direction deg, half-angle deg] — opens, sweeps down across the room, closes */
const FAN: Array<[number, number]> = [[197, 9], [193, 20], [189, 28], [185, 31], [182, 28], [179, 15]];
export const scanActive = (f: number) => f >= EV.scan[0] && f <= EV.scan[1];
export const orbIris = (f: number): [number, number] => [WIDE.orb[0], WIDE.orb[1] + orbBob(f)];
export const fanAt = (f: number) => FAN[Math.max(0, Math.min(FAN.length - 1, f - EV.scan[0]))];
/** the fixed point of the stepped dolly-out: the caret block's centre in the medium frame (caret 4x9 at CARET_FRAME + (0,-1)) */
const MACRO_Q: [number, number] = [CARET_FRAME[0] + 2, CARET_FRAME[1] + 3.5];
/** the cathedral's vanishing point sits on the fan's middle axis */
export const CATHEDRAL_VP: [number, number] = [168, 124];

export const GLYPH_WORLD: GlyphStyle = {
  cell: [2, 3], bloom: 0.85, tint: PAL.C6, tintAmt: 0.35, noise: 0.3, shimmer: 0.1, shimmerStep: 1,
  tone: {lo: 0.08, hi: 0.5, gamma: 0.8}, floor: 0.03, edgeAt: 1.0, seed: 19,
};

/** f114..f117: [family step, share of paper-white in an ordered dither], then the paper white at f118 */
const EXPOSE_FROM = 114;
const EXPOSURE: Array<[number, number]> = [[1, 0], [1, 0], [2, 0.25], [2, 0.62]];

// state handed from draw() to switch()/after() for the same frame (draw always runs first)
const frameState: {f: number; glyphMask: Mask | null; world: Buf; apex: [number, number]} = {f: -1, glyphMask: null, world: new Buf(W, H, PAL.N0), apex: [0, 0]};

const drawScan = (fb: Buf, f: number) => {
  const masMask = new Mask();
  const orbMask = new Mask();
  drawWide(fb, f, {masMask, orbMask, scanning: true});
  // Mas's forearms/hands are part of him too: they stay pixel
  masMask.addImg(masDeskFront(masDeskAt(f)), WIDE.mas[0], WIDE.mas[1]);
  const [dir, half] = fanAt(f);
  const [ax, ay] = orbIris(f);
  const cone = coneMask(ax + 0.5, ay + 0.5, dir, half, 520, {soft: 2.5, start: 6, fade: 30});
  // the beam lights the room just outside its own edges (one rung up, dithered), never Mas
  const spill = coneMask(ax + 0.5, ay + 0.5, dir, half + 7, 520, {soft: 6, start: 6, fade: 40}).subtract(cone).subtract(masMask);
  remap(fb, (c) => stepColor(c, 1), {mask: spill});
  const glyphMask = cone.clone().subtract(masMask).subtract(orbMask.dilate(1));
  drawCathedral(frameState.world, f, CATHEDRAL_VP);
  frameState.glyphMask = glyphMask;
  frameState.apex = [ax, ay];
};

// ------------------------------------------------------------------ the scene
export const coldOpen: SceneDef = {
  draw: (fb, f) => {
    frameState.f = f;
    frameState.glyphMask = null;
    const shot = shotAt(f).id;
    if (shot === 'macro9' || shot === 'macro3') {
      // centred on the caret's CENTRE (98, 79.5 in the medium frame), so every step is a punch on the same cursor
      // and the loop (f712 caret at 96-99 x 75-83) lands as a match, not a jump: anchor = Q + P * (CARET_FRAME - Q)
      const P = shot === 'macro9' ? 9 : 3;
      const anchor: [number, number] = [MACRO_Q[0] + P * (CARET_FRAME[0] - MACRO_Q[0]), MACRO_Q[1] + P * (CARET_FRAME[1] - MACRO_Q[1])];
      drawMacro(fb, screenAt(f), P, {focus: CARET_HOME, anchor});
      vignette(fb);
      return;
    }
    if (shot === 'white') { fb.c.fill(PAL.P2); return; }
    if (shot === 'wide') {
      if (scanActive(f)) drawScan(fb, f);
      else drawWide(fb, f);
      return;
    }
    drawMedium(fb, f);
    // exposure ramp into the white: the room climbs its own light ramps (palette steps, never a blend);
    // the token chips (pixel font, integer scale) are drawn over it, legible to their last frame
    const e = EXPOSURE[f - EXPOSE_FROM];
    if (e) remap(fb, (c, x, y) => (bayer4(x, y) < e[1] ? PAL.P2 : stepColor(c, e[0])));
    drawChips(fb, f);
    return;
  },
  // the white is the 1-bit paper of the next section: an exact white-to-white match cut into 1993
  palette: (f) => (shotAt(f).id === 'white' ? 'ONEBIT' : null),
  // the fan opens at f99 in BASE; the GLYPH window is f100-104 only (SCRIPT §3.2 / S1: 5 frames of the 15 budget)
  switch: (f) => (scanActive(f) && f >= EV.glyph[0] && frameState.f === f && frameState.glyphMask
    ? {type: 'glyph', mask: frameState.glyphMask, source: frameState.world, style: GLYPH_WORLD}
    : null),
  after: (ui, f) => {
    if (!scanActive(f)) return;
    // the fan's two edge rays (hot at the lens, cooling with distance) + a hot point on the iris
    const [ax, ay] = frameState.apex;
    const [dir, half] = fanAt(f);
    for (const s of [-1, 1]) {
      const a = ((dir + s * half) * Math.PI) / 180;
      const len = 520;
      let k = 0;
      line(ax, ay, Math.round(ax + Math.cos(a) * len), Math.round(ay + Math.sin(a) * len), (x, y) => {
        k++;
        if (k < 7) return;
        const col = k < 50 ? PAL.C8 : k < 140 ? PAL.C6 : PAL.C4;
        if (k > 140 && (x + y) % 2) return;
        ui.set(x, y, col);
      });
    }
    ui.set(ax, ay, PAL.C9);
    if (f <= EV.scan[0] + 1) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-2, 0], [2, 0]]) ui.set(ax + dx, ay + dy, PAL.C8);
  },
};
