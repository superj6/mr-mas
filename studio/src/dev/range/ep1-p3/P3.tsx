// MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): the clip. 437 f at 24 fps, 1920 x 1080, CPU.
//   p0-119    S7.02  [W] the bullpen walkout by day, pixel, the crowd breathing. Mas: "what happens to you if nopeai
//             disappears?"
//   p120-325  S7.02b [MCU] Tasya, right, pixel, lip-synced to the v5 take. A real cut: the room behind him is a closer
//             camera (1.25x, 5 output px per native px) with Mas small at his end desk behind him, left of him.
//             His three words change the room in three designed moves, each a soft-edged wipe on its word:
//               "below"  (p246-257) the vector floor spreads out from under him, both ways, to the frame's edges;
//               "above"  (p269-280) the vector ceiling spreads out from over his head the same way;
//               "around" (p292-308) a ring closes in from the frame's edges onto Mas's island: the walls, the staff,
//                        their boxes and the desks turn as it passes them, and it stops on Mas. His window-side rim
//                        lights when the ring passes Tasya.
//             Mas, his chair and his end desk (the two badges on it) stay pixel: the one island. Tasya stays pixel.
//   p326-388  S7.03  [MCU] Mas, left, pixel, looking straight down; a different, closer camera on the landlord's room
//             (1.5x, the door and the windows behind him), one value step lighter. "Hello." from the floor (p354).
//   p389-436  S7.05  [M] hard cut: Mada among the fires, pixel (the fires now light the room), the rail.
// Composition per frame: pixel layers at the shot's scale, nearest-neighbour (the engine's own frames), vector layers at
// output resolution through the same camera, stacked in the room's own painter's order.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {Buf} from '../../../shared/pixel/px';
import {PAL, hex} from '../../../shared/pixel/palette';
import * as PX from './pixel';
import * as V from './vector';
import {BULLPEN} from '../../../shared/pixel/rooms/bullpen';
import {RH} from './px-kit';

const OW = 1920, OH = 1080, S = 4, RA = RH * S;
/** the genre's depth cue (lighter, never blurred). S7.03 is [MCU·PF]: the room steps back one more value rung 10 f in,
 *  the animatic's own held focus pull (soft 2 -> 3 at k 10), told in the landlord's medium */
export const HAZE = {tasya: 0.05, masIn: 0.14, mas: 0.24, pullAt: 10};

// ------------------------------------------------------------------ cameras (native room px; z = scale over the wide)
export interface Cam { z: number; x0: number; y0: number }
/** Pass 6: each shot has its own camera on the room, so a cut reads as a cut (the cold read saw the MCUs' busts pop into
 *  the wide's locked frame). Tasya's is an integer 5 px per native px, so the pixel room keeps a clean grid; it keeps
 *  the ceiling and the floor in frame (his "above" and "below") and Mas at his end desk clear of Tasya's shoulder. */
export const CAM: Record<'wide' | 'tasya' | 'mas', Cam> = {
  wide: {z: 1, x0: 0, y0: 0},
  tasya: {z: 1.25, x0: 60, y0: 5},
  mas: {z: 1.5, x0: 160, y0: 68},
};
const K = (c: Cam) => S * c.z;
const outXY = (c: Cam, x: number, y: number): [number, number] => [(x - c.x0) * K(c), (y - c.y0) * K(c)];

// ------------------------------------------------------------------ canvases + caches (per render tab)
const canv = (w: number, h: number) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const CACHE = new Map<string, HTMLCanvasElement>();
const cached = (key: string, make: () => HTMLCanvasElement) => {
  let c = CACHE.get(key);
  if (!c) { c = make(); CACHE.set(key, c); if (CACHE.size > 40) CACHE.delete(CACHE.keys().next().value as string); }
  return c;
};
const SCRATCH = new Map<string, HTMLCanvasElement>();
/** a reusable per-frame canvas (cleared) */
const scratch = (key: string, w = OW, h = RA) => {
  let c = SCRATCH.get(key);
  if (!c) { c = canv(w, h); SCRATCH.set(key, c); }
  const x = c.getContext('2d')!;
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalCompositeOperation = 'source-over';
  x.globalAlpha = 1;
  x.filter = 'none';
  x.clearRect(0, 0, c.width, c.height);
  return c;
};
/** a native buffer (rows 0..h) as a canvas with alpha (TRANSP, or pixels failing `keep`, are transparent) */
const bufInto = (c: HTMLCanvasElement, b: Buf, h = 270, keep?: (i: number) => boolean) => {
  const x = c.getContext('2d')!;
  const img = x.createImageData(480, h);
  for (let i = 0; i < 480 * h; i++) {
    const v = b.c[i];
    const on = v < PX.TRANSP && (!keep || keep(i));
    img.data[i * 4] = (v >> 16) & 255; img.data[i * 4 + 1] = (v >> 8) & 255; img.data[i * 4 + 2] = v & 255; img.data[i * 4 + 3] = on ? 255 : 0;
  }
  x.putImageData(img, 0, 0);
  return c;
};
const bufCanvas = (b: Buf, h = 270, keep?: (i: number) => boolean) => bufInto(canv(480, h), b, h, keep);
/** a whole show frame (or a layer) at the wide's 4x, nearest */
const present = (ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, y = 0) => {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, 0, y * S, src.width * S, src.height * S);
};
/** a room-area layer (480 x RH native) through a camera, nearest, clipped to the room area */
const presentCam = (ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, cam: Cam) => {
  const k = K(cam);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, OW, RA); ctx.clip();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, -cam.x0 * k, -cam.y0 * k, 480 * k, RH * k);
  ctx.restore();
};
/** a vector layer: the room area (1920 x 812) through a camera (native coords), then the depth cue */
const drawVec = (cv: HTMLCanvasElement, cam: Cam, a: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const c = cv.getContext('2d')!;
  const k = K(cam);
  c.setTransform(k, 0, 0, k, -cam.x0 * k, -cam.y0 * k);
  draw(c);
  V.haze(c, a);
  c.setTransform(1, 0, 0, 1, 0, 0);
  return cv;
};
const vec = (key: string, cam: Cam, a: number, draw: (c: CanvasRenderingContext2D) => void) =>
  cached(`v:${key}:${cam.z}:${cam.x0}:${cam.y0}:${a}`, () => drawVec(canv(OW, RA), cam, a, draw));

// ------------------------------------------------------------------ the vector layers
const benchT = {stations: [0, 1, 2], x1: BULLPEN.stations[3][0] - 2};       // Tasya's MCU: Mas's end desk is pixel
const benchM = {stations: [0, 1, 2], x1: BULLPEN.bench.x1};                  // Mas's MCU: the bench behind him, empty
const shellV = (cam: Cam, a: number, skip?: ReadonlySet<number>) => vec(`shell${skip ? 'M' : ''}`, cam, a, (c) => { V.drawCeiling(c); V.drawWalls(c); V.drawFloor(c, {skip}); });
const benchBackV = (cam: Cam, a: number, mas: boolean) => vec(`bb${mas ? 'M' : 'T'}`, cam, a, (c) => V.drawBenchBack(c, mas ? benchM : benchT));
const benchFrontV = (cam: Cam, a: number, mas: boolean) => vec(`bf${mas ? 'M' : 'T'}`, cam, a, (c) => V.drawBenchFront(c, mas ? benchM : benchT));
/** the staff breathe (and blink in the hold), so their layers are drawn per frame */
const crowdOnto = (ctx: CanvasRenderingContext2D, cam: Cam, a: number, row: 'back' | 'front', p: number, skip?: ReadonlySet<number>) => {
  const cv = scratch('crowd');
  drawVec(cv, cam, a, (c) => V.drawCrowd(c, row, V.blinkingAt(p), p, skip));
  ctx.drawImage(cv, 0, 0);
};

// ------------------------------------------------------------------ the pixel layers of Tasya's MCU
/** one owner's pixels of the (crowd-free) plate: the island */
const pixLayer = (own: number) => cached(`px:${own}`, () => {
  const pl = PX.plate(false);
  return bufCanvas(pl.buf, RH, (i) => pl.own[i] === own);
});
/** a shell surface's vector drawing, only on that surface's pixels (what the room's objects don't cover) */
const surfaceV = (reg: number) => cached(`surf:${reg}`, () => {
  const pl = PX.plate(true);
  const m = canv(480, RH);
  const mx = m.getContext('2d')!;
  const img = mx.createImageData(480, RH);
  for (let i = 0; i < 480 * RH; i++) img.data[i * 4 + 3] = pl.own[i] === PX.OWN.shell && pl.reg[i] === reg ? 255 : 0;
  mx.putImageData(img, 0, 0);
  const out = canv(OW, RA);
  const c = out.getContext('2d')!;
  c.drawImage(shellV(CAM.tasya, HAZE.tasya), 0, 0);
  c.globalCompositeOperation = 'destination-in';
  presentCam(c, m, CAM.tasya);
  return out;
});
const bandCanvas = () => cached('band', () => { const b = new Buf(480, 270, PAL.N0); PX.band(b); const c = canv(480, 67); c.getContext('2d')!.drawImage(bufCanvas(b), 0, -RH); return c; });

// ------------------------------------------------------------------ the three moves
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const prog = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** where "below" and "above" start: under / over Tasya (his bust's centre, which is not on the room's camera) */
const SPREAD_X = PX.TASYA_C[0] * S;
const SPREAD_F = 64; // the wipe's soft edge (output px): the house style's own motion, never a hard line
const SPREAD_D = Math.max(SPREAD_X, OW - SPREAD_X) + SPREAD_F;
/** a surface spreading out from x = SPREAD_X both ways: its drawing where |x - SPREAD_X| < d, soft-edged */
const spreadOnto = (ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, t: number) => {
  if (t <= 0) return;
  if (t >= 1) { ctx.drawImage(src, 0, 0); return; }
  const d = SPREAD_D * easeOut(t);
  const cv = scratch('spread');
  const c = cv.getContext('2d')!;
  c.drawImage(src, 0, 0);
  c.globalCompositeOperation = 'destination-in';
  const x0 = SPREAD_X - d - SPREAD_F / 2, x1 = SPREAD_X + d + SPREAD_F / 2, w = x1 - x0, f = SPREAD_F / w;
  const g = c.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(Math.min(0.5, f), 'rgba(0,0,0,1)');
  g.addColorStop(Math.max(0.5, 1 - f), 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, OW, RA);
  ctx.drawImage(cv, 0, 0);
};
/** "around": a ring closing in on Mas's island (its centre, through Tasya's camera) */
const RING_C = outXY(CAM.tasya, PX.MAS_AT()[0] + 15, PX.MAS_AT()[1] + 20);
const RING_F = 28;
const RING_R0 = Math.hypot(Math.max(RING_C[0], OW - RING_C[0]), Math.max(RING_C[1], RA - RING_C[1])) + RING_F;
export const ringR = (p: number) => RING_R0 * (1 - easeInOut(prog(p, PX.T.iris)));
/** Tasya's rim lights when the ring has passed his centre (the room that is lit by the window reaches him) */
const TASYA_RING_D = Math.hypot(PX.TASYA_C[0] * S - RING_C[0], PX.TASYA_C[1] * S - RING_C[1]);

/** the landlord's whole room in Tasya's MCU, the island in pixel, at frame p */
const roomB = (p: number) => {
  const cam = CAM.tasya, a = HAZE.tasya;
  const cv = scratch('roomB');
  const c = cv.getContext('2d')!;
  c.drawImage(shellV(cam, a), 0, 0);
  c.drawImage(benchBackV(cam, a, false), 0, 0);
  crowdOnto(c, cam, a, 'back', p);
  c.drawImage(benchFrontV(cam, a, false), 0, 0);
  presentCam(c, pixLayer(PX.OWN.island), cam);
  crowdOnto(c, cam, a, 'front', p);
  return cv;
};

/** S7.03's camera has the two staff nearest Mas (x 348 by the window, x 332 at his desk's end) straight behind his head
 *  and shoulder: in his single they are behind the lens's side of him, so they're not drawn (no heads growing out of his) */
const MAS_SKIP = new Set([5, 18]);

// ------------------------------------------------------------------ one frame
export const drawFrame = (ctx: CanvasRenderingContext2D, p: number) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = hex(PAL.N0);
  ctx.fillRect(0, 0, OW, OH);
  if (p < PX.T.tasya) { present(ctx, bufInto(scratch('native', 480, 270), PX.wideFrame(p))); return; }
  if (p >= PX.T.mada) { present(ctx, bufInto(scratch('native', 480, 270), PX.madaFrame(p))); return; }
  if (p < PX.T.mas) {
    const cam = CAM.tasya;
    const r = ringR(p);
    if (p < PX.T.iris[1]) {
      // the pixel room (breathing), with the floor and the ceiling as far as their spreads have got
      presentCam(ctx, bufInto(scratch('plate', 480, RH), PX.plateAt(p), RH), cam);
      spreadOnto(ctx, surfaceV(PX.REG.floor), prog(p, PX.T.floor));
      spreadOnto(ctx, surfaceV(PX.REG.ceiling), prog(p, PX.T.ceiling));
    }
    if (p >= PX.T.iris[0]) {
      const B = roomB(p);
      if (p < PX.T.iris[1]) {
        const c = B.getContext('2d')!;
        c.globalCompositeOperation = 'destination-in';
        const g = c.createRadialGradient(RING_C[0], RING_C[1], Math.max(0, r - RING_F / 2), RING_C[0], RING_C[1], r + RING_F / 2);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
        c.fillStyle = g;
        c.fillRect(0, 0, OW, RA);
        c.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(B, 0, 0);
    }
    present(ctx, bandCanvas(), RH);
    const lit = p >= PX.T.iris[0] && r < TASYA_RING_D;
    present(ctx, bufInto(scratch('bust', 480, RH), PX.tasyaLayer(p, lit), RH));
    return;
  }
  // S7.03: the one pixel island, looking down at the landlord, on its own camera
  const cam = CAM.mas;
  const a = p < PX.T.mas + HAZE.pullAt ? HAZE.masIn : HAZE.mas;
  ctx.drawImage(shellV(cam, a, MAS_SKIP), 0, 0);
  ctx.drawImage(benchBackV(cam, a, true), 0, 0);
  crowdOnto(ctx, cam, a, 'back', p, MAS_SKIP);
  ctx.drawImage(benchFrontV(cam, a, true), 0, 0);
  crowdOnto(ctx, cam, a, 'front', p, MAS_SKIP);
  present(ctx, bandCanvas(), RH);
  present(ctx, bufInto(scratch('bust', 480, RH), PX.masLayer(p), RH));
};

let fontsReady: Promise<unknown> | null = null;
const ensureFonts = () => (fontsReady ??= Promise.all([document.fonts.load('700 30px Jost'), document.fonts.load('400 30px Jost')]).then(() => document.fonts.ready));

export const P3: React.FC<{at?: number}> = ({at}) => {
  const cur = useCurrentFrame();
  const p = at ?? cur;
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`ep1-p3 p${p}`);
    ensureFonts()
      .then(() => { const cv = ref.current; if (cv) drawFrame(cv.getContext('2d')!, p); continueRender(h); })
      .catch((e) => cancelRender(e));
  }, [p]);
  return (
    <AbsoluteFill style={{background: hex(PAL.N0)}}>
      <canvas ref={ref} width={OW} height={OH} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
