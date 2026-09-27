// MR. MAS - style-range prototype E1-P3 (1.D, BELOW, ABOVE, AROUND): the clip. 437 f at 24 fps, 1920 x 1080, CPU.
//   p0-119    S7.02  [W] the bullpen walkout on a wet day, pixel: one of the staff walks out past the hall, heads turn,
//             boxes get re-gripped, a drizzle runs past the windows. Mas: "what happens to you if nopeai disappears?"
//   p120-325  S7.02b [MCU] Tasya, left, pixel, lip-synced to the v5 take, breathing, nodding on his stresses, leaning in on
//             the last phrase. A real cut: the room behind him is a closer camera (1.25x, 5 output px per native px)
//             with Mas small at his end desk in his eyeline. His three words change the room in three designed moves:
//               "below"  (p246-257) the vector floor is LAID out from the floor line under him, both ways, along the
//                        plate's own perspective, a crisp edge with a cloud-white seam at its front;
//               "above"  (p269-280) the vector ceiling is laid out from the ceiling line over his head the same way;
//               "around" (p292-308) a crisp iris with a thin white rim closes in from the frame's edges onto Mas's
//                        island: the walls, the staff, their boxes and the desks turn as it passes them, and it closes
//                        on Mas. Tasya's window-side rim lights when the ring passes him.
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
const shellV = (cam: Cam, a: number, skip?: ReadonlySet<number>) => vec(`shell${skip ? [...skip].join('.') : ''}`, cam, a, (c) => { V.drawCeiling(c); V.drawWalls(c); V.drawFloor(c, {skip}); });
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
  const pl = PX.plate('none');
  return bufCanvas(pl.buf, RH, (i) => pl.own[i] === own);
});
/** a shell surface's vector drawing, only on that surface's pixels (what the room's objects don't cover) */
const surfaceV = (reg: number) => cached(`surf:${reg}`, () => {
  const pl = PX.plate('back');
  const m = canv(480, RH);
  const mx = m.getContext('2d')!;
  const img = mx.createImageData(480, RH);
  for (let i = 0; i < 480 * RH; i++) img.data[i * 4 + 3] = pl.own[i] === PX.OWN.shell && pl.reg[i] === reg ? 255 : 0;
  mx.putImageData(img, 0, 0);
  const out = canv(OW, RA);
  const c = out.getContext('2d')!;
  c.drawImage(shellV(CAM.tasya, HAZE.tasya, TASYA_SKIP), 0, 0);
  c.globalCompositeOperation = 'destination-in';
  presentCam(c, m, CAM.tasya);
  return out;
});
const bandCanvas = () => cached('band', () => { const b = new Buf(480, 270, PAL.N0); PX.band(b); const c = canv(480, 67); c.getContext('2d')!.drawImage(bufCanvas(b), 0, -RH); return c; });

// ------------------------------------------------------------------ the three moves
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const prog = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/**
 * "below" and "above" (pass 7). Pass 6 spread each surface out from under / over him with a 64 px soft edge, which at
 * speed read as a fade more than a move. Now each surface is LAID along the room's own perspective grid, the way the
 * house style builds a scene: the edge is a floor (ceiling) line of the plate's vanishing point, crisp, sweeping out
 * both ways from the line under (over) him, eased, and on the floor it carries a thin cloud-white seam, so the move has
 * a front you can follow. Room coordinates, through Tasya's camera.
 */
const G = BULLPEN;
const floorLineX = (xw: number, y: number) => G.vp[0] + ((xw - G.vp[0]) * (y - G.vp[1])) / (G.floorY - G.vp[1]);
const ceilLineX = (xw: number, y: number) => G.vp[0] + ((xw - G.vp[0]) * (G.vp[1] - y)) / (G.vp[1] - G.ceilY);
/** Tasya's centre in room x (his bust is on the frame, not on the room's camera) */
const TASYA_RX = CAM.tasya.x0 + (PX.TASYA_C[0] * S) / K(CAM.tasya);
/** the wall-base (wall-top) x of the floor (ceiling) line that passes under (over) him at the frame's bottom (top) */
const FLOOR_XW = G.vp[0] + ((TASYA_RX - G.vp[0]) * (G.floorY - G.vp[1])) / (RH - G.vp[1]);
const CEIL_XW = G.vp[0] + ((TASYA_RX - G.vp[0]) * (G.vp[1] - G.ceilY)) / (G.vp[1] - CAM.tasya.y0);
const easeOut2 = (t: number) => 1 - (1 - t) * (1 - t);
/** a surface laid out from its line under / over him, both ways, `t` 0..1 */
const layOnto = (ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, t: number, surface: 'floor' | 'ceiling') => {
  if (t <= 0) return;
  if (t >= 1) { ctx.drawImage(src, 0, 0); return; }
  const floor = surface === 'floor';
  const x0w = floor ? FLOOR_XW : CEIL_XW;
  const d = (Math.max(x0w, 480 - x0w) + 60) * easeOut2(t);
  const [ya, yb] = floor ? [G.floorY - 1, RH + 1] : [G.ceilY + 1, -1];
  const lx = floor ? floorLineX : ceilLineX;
  const edge = (xw: number): [number, number, number, number] => [lx(xw, ya), ya, lx(xw, yb), yb];
  const cv = scratch('spread');
  const c = cv.getContext('2d')!;
  c.drawImage(src, 0, 0);
  const k = K(CAM.tasya);
  c.setTransform(k, 0, 0, k, -CAM.tasya.x0 * k, -CAM.tasya.y0 * k);
  const L = edge(x0w - d), R = edge(x0w + d);
  c.globalCompositeOperation = 'destination-in';
  c.beginPath(); c.moveTo(L[0], L[1]); c.lineTo(R[0], R[1]); c.lineTo(R[2], R[3]); c.lineTo(L[2], L[3]); c.closePath();
  c.fillStyle = '#000'; c.fill();
  if (floor) {
    // the seam at the front: on the laid floor's own pixels only, fading as it reaches the frame's edges
    c.globalCompositeOperation = 'source-atop';
    c.lineWidth = 0.9; c.lineCap = 'butt';
    c.strokeStyle = `rgba(243,246,250,${0.85 * (1 - t * 0.6)})`;
    for (const e of [L, R]) { c.beginPath(); c.moveTo(e[0], e[1]); c.lineTo(e[2], e[3]); c.stroke(); }
  }
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalCompositeOperation = 'source-over';
  ctx.drawImage(cv, 0, 0);
};
/** "around": a ring closing in on Mas's island (its centre, through Tasya's camera) */
const RING_C = outXY(CAM.tasya, PX.MAS_AT()[0] + 15, PX.MAS_AT()[1] + 20);
const RING_R0 = Math.hypot(Math.max(RING_C[0], OW - RING_C[0]), Math.max(RING_C[1], RA - RING_C[1])) + 8;
/** the ring's radius: fast while it crosses the room on "a-ROUND" (most of the frame by p301), then it tightens slowly
 *  onto Mas through "them" (lands p308) */
export const ringR = (p: number) => RING_R0 * Math.pow(1 - prog(p, PX.T.iris), 2.2);
/** Tasya's rim lights when the ring has passed his centre (the room that is lit by the window reaches him) */
const TASYA_RING_D = Math.hypot(PX.TASYA_C[0] * S - RING_C[0], PX.TASYA_C[1] * S - RING_C[1]);

/** the landlord's whole room in Tasya's MCU, the island in pixel, at frame p */
const roomB = (p: number) => {
  const cam = CAM.tasya, a = HAZE.tasya;
  const cv = scratch('roomB');
  const c = cv.getContext('2d')!;
  c.drawImage(shellV(cam, a, TASYA_SKIP), 0, 0);
  c.drawImage(benchBackV(cam, a, false), 0, 0);
  crowdOnto(c, cam, a, 'back', p);
  c.drawImage(benchFrontV(cam, a, false), 0, 0);
  presentCam(c, pixLayer(PX.OWN.island), cam);
  return cv;
};

/** the MCUs' rooms have the back row only (PX.CrowdSet 'back': the front row stands at the singles' own depth, off to the
 *  lens's sides); S7.03 also leaves out the one by the window (x 348) whose head would grow out of Mas's */
const FRONT_ROW = new Set(PX.CROWD.filter((e) => e.layer !== PX.OWN.back).map((e) => e.seed));
const TASYA_SKIP = FRONT_ROW;
const MAS_SKIP = new Set([...FRONT_ROW, 5]);

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
      layOnto(ctx, surfaceV(PX.REG.floor), prog(p, PX.T.floor), 'floor');
      layOnto(ctx, surfaceV(PX.REG.ceiling), prog(p, PX.T.ceiling), 'ceiling');
    }
    if (p >= PX.T.iris[0]) {
      const B = roomB(p);
      if (p < PX.T.iris[1]) {
        // pass 7: a crisp iris (pass 6's 28 px soft edge printed as a dark smudge ringing the pixel room), with a thin
        // cloud-white rim on its front, the house style's own edge
        const c = B.getContext('2d')!;
        c.globalCompositeOperation = 'destination-out';
        c.beginPath(); c.arc(RING_C[0], RING_C[1], r, 0, Math.PI * 2); c.fillStyle = '#000'; c.fill();
        c.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(B, 0, 0);
      if (p < PX.T.iris[1] && r > 2) {
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, OW, RA); ctx.clip();
        ctx.beginPath(); ctx.arc(RING_C[0], RING_C[1], r + 1.5, 0, Math.PI * 2);
        ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(243,246,250,0.9)'; ctx.stroke();
        ctx.beginPath(); ctx.arc(RING_C[0], RING_C[1], r + 7, 0, Math.PI * 2);
        ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(243,246,250,0.18)'; ctx.stroke();
        ctx.restore();
      }
    }
    present(ctx, bandCanvas(), RH);
    const lit = p >= PX.T.iris[0] && r < TASYA_RING_D;
    present(ctx, bufInto(scratch('bust', 480, RH), PX.tasyaLayer(p, lit), RH));
    return;
  }
  // S7.03: the one pixel island, looking down at the landlord, on its own camera
  const cam = CAM.mas;
  // the held focus pull, told in the landlord's medium: the room steps back one value rung, smoothly over 16 frames
  // (p336-351, landing just before "Hello."; the cold read asked for a 12-18 frame pull, not a one-frame snap)
  const pull = easeInOut(clamp01((p - PX.T.mas - HAZE.pullAt) / 16));
  const a = Math.round((HAZE.masIn + (HAZE.mas - HAZE.masIn) * pull) * 50) / 50; // 0.02 steps: 6 cached rooms, no visible step
  ctx.drawImage(shellV(cam, a, MAS_SKIP), 0, 0);
  ctx.drawImage(benchBackV(cam, a, true), 0, 0);
  crowdOnto(ctx, cam, a, 'back', p, MAS_SKIP);
  ctx.drawImage(benchFrontV(cam, a, true), 0, 0);
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
