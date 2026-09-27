// MR. MAS · range E1-P2 (1.H, WHAT THE QUACK): the Remotion host. CPU only (2D canvas), one canvas per frame:
//   1. the native 480 x 270 pixel frame: the [OTS] room (ots.ts) or the [2S] (twoshot.ts), and the band with the rail,
//      presented at 4x nearest-neighbour;
//   2. [OTS] only: ELGOOG's product film at output resolution inside the screen: one frame of the Blender take (or the
//      strip of three stills), the film's own super drawn INTO it, then graded (grade.ts) so it sits in the room;
//   3. the monitor's own pixel UI over the film (the player's title strip, the chyron caption);
//   4. the Orb's eye-light on the glass, drawn on the native grid (4 x 4 cells), screen-blended over the film.
// The take's frames are served from --public-dir (tools/build.sh points it at the scratch folder holding take/f###.png).
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {Buf, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, hex} from '../../../shared/pixel/palette';
import {text} from '../../../shared/pixel/font';
import {drawBand} from '../p4/passes/band';
import {plan, framesOf, Version, SUPER, RAIL, Beat} from './plan';
import {drawOTS, drawTitleStrip, drawCaption, drawStripField, newUI, SCR, SCALE, STILL, stillX, eyeCells, EYE_STEPS} from './ots';
import {draw2S, toPalette, SMALL, StillPx} from './twoshot';
import {gradeRGBA} from './grade';

const OW = SCR.w * SCALE, OH = SCR.h * SCALE;          // the film's size at output: 1056 x 592
const imgs = new Map<number, Promise<HTMLImageElement>>();
const loadTake = (t: number) => {
  let p = imgs.get(t);
  if (!p) {
    p = new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = () => rej(new Error(`take frame ${t} missing: run tools/build.sh (take/f${String(t).padStart(3, '0')}.png)`));
      im.src = staticFile(`take/f${String(t).padStart(3, '0')}.png`);
    });
    imgs.set(t, p);
  }
  return p;
};
let fontP: Promise<unknown> | null = null;
const fonts = () => (fontP ??= Promise.all([document.fonts.load('400 46px Jost'), document.fonts.load('400 16px Jost')]));

const canvas = (w: number, h: number) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

/** the film's own super, drawn into a film-sized context (scale 1 = the full film) */
const drawSuper = (ctx: CanvasRenderingContext2D, a: number, s = 1) => {
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = '#2b2c30';
  // 46 px (11.5 px at phone size): big enough to read at 480x270, small enough to stay clear of the duck's chest
  ctx.font = `400 ${Math.round(46 * s)}px Jost`;
  (ctx as unknown as {letterSpacing: string}).letterSpacing = `${(0.6 * s).toFixed(2)}px`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(SUPER, 52 * s, 548 * s);
  ctx.restore();
};

/** one graded film frame (the take's frame + its super), at output size */
const filmFrame = (im: HTMLImageElement, superA: number, t: number) => {
  const c = canvas(OW, OH);
  const x = c.getContext('2d')!;
  x.imageSmoothingQuality = 'high';
  x.drawImage(im, 0, 0, OW, OH);
  drawSuper(x, superA);
  const d = x.getImageData(0, 0, OW, OH);
  gradeRGBA(d.data, OW, OH, t);
  x.putImageData(d, 0, 0);
  return c;
};
/** a still for the strip: the full graded frame, reduced (the super only on the first) */
const stillCache = new Map<string, HTMLCanvasElement>();
const stillOf = (im: HTMLImageElement, t: number, withSuper: boolean) => {
  const key = `${t}:${withSuper}`;
  let c = stillCache.get(key);
  if (!c) {
    const full = filmFrame(im, withSuper ? 1 : 0, t);
    c = canvas(STILL.w * SCALE, STILL.h * SCALE);
    const x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(full, 0, 0, c.width, c.height);
    stillCache.set(key, c);
  }
  return c;
};
/** the stills in the room's own pixels (for the [2S]'s small monitor) */
const pxCache = new Map<number, StillPx>();
const stillPx = (im: HTMLImageElement, t: number) => {
  let s = pxCache.get(t);
  if (!s) {
    const c = canvas(SMALL.w, SMALL.h);
    const x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(filmFrame(im, 0, t), 0, 0, SMALL.w, SMALL.h);
    s = toPalette(x.getImageData(0, 0, SMALL.w, SMALL.h).data, SMALL.w, SMALL.h);
    pxCache.set(t, s);
  }
  return s;
};

/** present a native Buf at 4x (TRANSPARENT pixels skipped) */
const present = (ctx: CanvasRenderingContext2D, b: Buf) => {
  const c = canvas(b.w, b.h);
  const x = c.getContext('2d')!;
  const id = x.createImageData(b.w, b.h);
  for (let i = 0; i < b.c.length; i++) {
    const v = b.c[i];
    if (v >= TRANSPARENT) continue;
    id.data[i * 4] = (v >> 16) & 255; id.data[i * 4 + 1] = (v >> 8) & 255; id.data[i * 4 + 2] = v & 255; id.data[i * 4 + 3] = 255;
  }
  x.putImageData(id, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(c, 0, 0, b.w * SCALE, b.h * SCALE);
};

/** the Orb's eye-light: its cells on the native grid, screen-blended over the glass */
const eyeLight = (ctx: CanvasRenderingContext2D, step: number) => {
  if (step <= 0) return;
  const cx = EYE_STEPS[Math.min(3, step - 1)];
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const fill: Record<number, [number, number]> = {1: [PAL.C2, 0.55], 2: [PAL.C2, 0.4], 3: [PAL.C5, 0.62], 4: [PAL.C7, 0.9]};
  for (const [x, y, k] of eyeCells(cx)) {
    const [col, a] = fill[k];
    ctx.globalAlpha = a;
    ctx.fillStyle = hex(col);
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
  }
  ctx.restore();
};

/** the band: the adventure layout's verb band, dimmed for a cutscene; the rail types on its sentence line */
let BAND: Buf | null = null;
const band = (b: Buf, beat: Beat) => {
  if (!BAND) { BAND = new Buf(480, 270, PAL.N0); drawBand(BAND, {cutscene: true}); }
  b.c.set(BAND.c.subarray(203 * 480), 203 * 480);
  if (beat.rail > 0) text(b, RAIL.slice(0, beat.rail), 12, 208, PAL.P1, {shadow: PAL.N0});
};

export const drawFrame = async (ctx: CanvasRenderingContext2D, v: Version, p: number) => {
  await fonts();
  const beat = plan(v, p);
  const ims = await Promise.all(framesOf(beat).map(loadTake));
  ctx.fillStyle = hex(PAL.N0);
  ctx.fillRect(0, 0, 1920, 1080);
  const fb = new Buf(480, 270, PAL.N0);
  if (beat.shot === '2s') {
    draw2S(fb, p, beat, ims.map((im, i) => stillPx(im, framesOf(beat)[i])));
    band(fb, beat);
    present(ctx, fb);
    return beat;
  }
  drawOTS(fb, p);
  band(fb, beat);
  present(ctx, fb);
  const ui = newUI();
  const X = SCR.x * SCALE, Y = SCR.y * SCALE;
  if (beat.film.kind === 'frame') {
    ctx.drawImage(filmFrame(ims[0], beat.superA, beat.film.t), X, Y);
  } else {
    drawStripField(ui);
    present(ctx, ui);
    beat.film.ts.forEach((t, i) => ctx.drawImage(stillOf(ims[i], t, i === 0), (SCR.x + stillX(i)) * SCALE, (SCR.y + STILL.y0) * SCALE));
  }
  const ui2 = newUI();
  drawTitleStrip(ui2);
  drawCaption(ui2, beat.caption);
  present(ctx, ui2);
  eyeLight(ctx, beat.eye);
  return beat;
};

export const EP1P2: React.FC<{version: Version}> = ({version}) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`ep1-p2 ${version} p${f}`);
    const cv = ref.current;
    if (!cv) { continueRender(h); return; }
    drawFrame(cv.getContext('2d')!, version, f).then(() => continueRender(h)).catch((e) => cancelRender(e));
  }, [f, version]);
  return (
    <AbsoluteFill style={{background: hex(PAL.N0)}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};

/** the screen's matte (white = the film's area in the [OTS]), for the outside-layer composite */
export const Matte: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', left: SCR.x * SCALE, top: SCR.y * SCALE, width: OW, height: OH, background: '#fff'}} />
  </AbsoluteFill>
);
