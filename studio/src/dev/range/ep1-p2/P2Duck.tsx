// MR. MAS · range E1-P2 (1.H, WHAT THE QUACK): the Remotion host (v5). CPU only (2D canvas), one canvas per frame:
//   1. the native 480 x 270 pixel frame: the [OTS] room (ots.ts) or the [2S] (twoshot.ts), and the band with the rail,
//      presented at 4x nearest-neighbour;
//   2. [OTS] only: ELGOOG's product film at output resolution inside the screen: one frame of the Blender take, the
//      film's own super drawn INTO it, then graded (grade.ts) so it sits in the room; or the contact sheet of six
//      stills (the frozen frame stepping down into the last cell, the others dealt in);
//   3. the monitor's own pixel UI over the film (the player's title strip, the sheet's frame numbers, the chyron);
//   4. the Orb's scan beam, drawn on the native grid (4 x 4 cells) and screen-blended over the room and the glass;
//   5. the cast layer: Mas's silhouette and the Orb (nearer the lens than him), native, over everything.
// The take's frames are served from --public-dir (tools/build.sh points it at the scratch folder holding take/f###.png).
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {Buf, TRANSPARENT, rect} from '../../../shared/pixel/px';
import {PAL, hex} from '../../../shared/pixel/palette';
import {text} from '../../../shared/pixel/font';
import {drawBand} from '../p4/passes/band';
import {plan, framesOf, Version, SUPER, RAIL, Beat} from './plan';
import {drawOTS, drawCast, drawTitleStrip, drawCaption, drawSheetField, drawStillTabs, newUI, SCR, SCALE, STILL, cellXY, beamCells, orbLens, FILM_RECT, GRID_RECT, Rect} from './ots';
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
/** a still for the sheet: the full graded frame, reduced (the super only on the first) */
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

/** the Orb's scan beam: its cells on the native grid, screen-blended over the room and the glass */
const BEAM_INK: Record<number, [number, number]> = {1: [PAL.C3, 0.55], 2: [PAL.C4, 0.6], 3: [PAL.C2, 0.22], 4: [PAL.C6, 0.95], 5: [PAL.C6, 0.5], 6: [PAL.C3, 0.35]};
const drawBeam = (ctx: CanvasRenderingContext2D, lens: [number, number], fp: Rect, t: number) => {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const [x, y, k] of beamCells(lens, fp, t)) {
    const [col, a] = BEAM_INK[k];
    ctx.globalAlpha = a;
    ctx.fillStyle = hex(col);
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
  }
  ctx.restore();
};
/** the frozen frame's rect while it steps down into the sheet's last cell (native): 1 = halfway, 2 = in its cell */
const frozenRect = (shrink: number): Rect => {
  const [cx, cy] = cellXY(5);
  const cell = {x: SCR.x + cx, y: SCR.y + cy, w: STILL.w, h: STILL.h};
  if (shrink >= 2) return cell;
  const k = 0.5;
  const full = {x: SCR.x, y: SCR.y, w: SCR.w, h: SCR.h};
  const w = Math.round(full.w + (cell.w - full.w) * k), h = Math.round(full.h + (cell.h - full.h) * k);
  return {x: Math.round(full.x + (cell.x - full.x) * k), y: Math.round(full.y + (cell.y - full.y) * k), w, h};
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
  const X = SCR.x * SCALE, Y = SCR.y * SCALE;
  let fp: Rect = FILM_RECT;
  const ui2 = newUI();
  if (beat.film.kind === 'frame') {
    ctx.drawImage(filmFrame(ims[0], beat.superA, beat.film.t), X, Y);
  } else {
    const f = beat.film;
    const dealt = Array.from({length: f.n}, (_, i) => i);
    const cells = f.shrink >= 2 ? [...dealt, 5] : dealt;
    const ui = newUI();
    drawSheetField(ui, cells);
    present(ctx, ui);
    dealt.forEach((i) => { const [cx, cy] = cellXY(i); ctx.drawImage(stillOf(ims[i], f.ts[i], i === 0), (SCR.x + cx) * SCALE, (SCR.y + cy) * SCALE); });
    // (the super rides on the first still and on the frozen one, the film's frame as it froze)
    // the frozen frame: halfway (a reduced copy of the full graded frame), then in its cell
    const r = frozenRect(f.shrink);
    const last = f.ts[5];
    if (f.shrink >= 2) ctx.drawImage(stillOf(ims[5], last, true), r.x * SCALE, r.y * SCALE);
    else {
      rect(r.x - 1, r.y - 1, r.w + 2, r.h + 2, ui2.ink(PAL.N0));
      present(ctx, ui2);
      ui2.c.fill(TRANSPARENT);
      ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(filmFrame(ims[5], 1, last), r.x * SCALE, r.y * SCALE, r.w * SCALE, r.h * SCALE);
      ctx.restore();
    }
    drawStillTabs(ui2, cells, f.ts);
    // the beam stays on the whole picture while the frozen frame steps down and the others are dealt, then takes the sheet
    fp = f.shrink >= 2 && f.n >= 5 ? GRID_RECT : FILM_RECT;
  }
  drawTitleStrip(ui2);
  drawCaption(ui2, beat.caption);
  present(ctx, ui2);
  if (beat.beam > 0) drawBeam(ctx, orbLens(p), fp, beat.beam);
  const cast = newUI();
  drawCast(cast, p, {lean: beat.lean, orbAp: beat.orbAp, fire: beat.fire});
  present(ctx, cast);
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
