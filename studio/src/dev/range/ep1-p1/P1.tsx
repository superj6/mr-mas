// MR. MAS — range E1-P1 (1.A): the clip. Per frame: the pixel frame (pixel.ts) presented at 4x, nearest; then, from
// the slam to the cut, the clay cel of that drawing (gl/cels.ts's exposure sheet; rendered beforehand on the iGPU by
// `ep1-p1-cels`) composited at output resolution over it: colour + (1 - coverage) x the pixel frame. The pixel frame
// already carries what the clay does to it (the pool, the contact shadow in rungs), so the two worlds meet in each
// one's own language: the clay's soft edge and miniature focus against pixels that stay on their grid.
// Round 5: (1) the filament's ramp: for its first four drawings the clay blends from its night render to its lit one,
// warm first (a tungsten coming up goes orange before it goes white), in step with the pixel light's rungs; (2) a
// light wrap: the pane's own light, blurred, bleeds a few pixels onto the clay's silhouette (strongest where the
// room behind is bright: the hot spot, the lit desk), the compositor's standard fix for a figure that sits ON a plate
// instead of IN it.
import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {Buf} from '../../../shared/pixel/px';
import {drawFrame, setClodPixel, setMouthTrack} from './pixel';
import {celIndexAt, clayAt, nightIndexAt, setClodMouth, TILE} from './gl/cels';
import {lightAt, flashExpAt} from './timeline';
import {loadClodPixel, ClodPixelJSON} from './clodpx';
import clodPx from './gen/clod-px.json';
import takes from './gen/takes.json';

type TakeJSON = Record<string, {frames: number; mouth: Array<{f: number; shape: string}>}>;
let ready = false;
const setup = () => {
  if (ready) return;
  ready = true;
  const t = takes as unknown as TakeJSON;
  setMouthTrack(t['mario-memo'].mouth, t['mario-addendum'].mouth);
  if (t['clod-right'].mouth.length) setClodMouth(t['clod-right'].mouth);
  const j = clodPx as unknown as ClodPixelJSON;
  if (j.frames.length) setClodPixel(loadClodPixel(j));
};

const imgCache = new Map<number, Promise<HTMLImageElement>>();
const loadCel = (i: number) => {
  let p = imgCache.get(i);
  if (!p) {
    p = new Promise<HTMLImageElement>((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error(`cel ${i} missing`)); im.src = staticFile(`cels/cel-${String(i).padStart(3, '0')}.png`); });
    imgCache.set(i, p);
  }
  return p;
};

export const P1: React.FC<{hold?: number}> = ({hold}) => {
  const cur = useCurrentFrame();
  const f = hold ?? cur;
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender(`e1p1 f${f}`, {timeoutInMilliseconds: 120000});
    (async () => {
      setup();
      const fb = new Buf(480, 270);
      drawFrame(fb, f, clayAt(f));
      const cv = ref.current!;
      const ctx = cv.getContext('2d', {willReadFrequently: true})!;
      const small = document.createElement('canvas'); small.width = 480; small.height = 270;
      const sctx = small.getContext('2d')!;
      const id = sctx.createImageData(480, 270); fb.toRGBA(id.data); sctx.putImageData(id, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, 1920, 1080);
      const ci = celIndexAt(f);
      if (ci >= 0) {
        const W = TILE.w, H = TILE.h, W2 = W * 2;
        const read = async (idx: number) => {
          const im = await loadCel(idx);
          const tmp = document.createElement('canvas'); tmp.width = W2; tmp.height = H;
          const tctx = tmp.getContext('2d', {willReadFrequently: true})!;
          tctx.drawImage(im, 0, 0, W2, H, 0, 0, W2, H);
          return tctx.getImageData(0, 0, W2, H).data;
        };
        const cel = await read(ci);
        const ni = nightIndexAt(f);
        const night = ni >= 0 ? await read(ni) : null;
        const lv = lightAt(f);
        // round 6: the strike. The clay is lit from its first frame (no dim clay before the light), overexposed and
        // settling over three drawings (the camera catching up with the can), warm first; then a soft shoulder keeps
        // every pixel under 78 % luma, the frame's white ceiling
        const ex = flashExpAt(f), lift = ex > 1.5 ? 38 : 0;
        // the lit render's weight and its tungsten tint while the filament comes up
        const wl = night ? lv : 1;
        const tint = night ? [1, 0.8 + 0.2 * lv, 0.58 + 0.42 * lv] : [1, 1, 1];
        const bg = ctx.getImageData(TILE.x, TILE.y, W, H);
        const d = bg.data;
        // the light wrap's inputs: the plate blurred (radius 9) and the clay's coverage blurred (radius 5)
        const alpha = new Float32Array(W * H);
        for (let q = 0; q < W * H; q++) alpha[q] = cel[(((q / W) | 0) * W2 + W + (q % W)) * 4] / 255;
        const box = (src: Float32Array, r: number) => {
          const tmp = new Float32Array(W * H), out = new Float32Array(W * H), n = 2 * r + 1;
          for (let y = 0; y < H; y++) { let acc = 0; for (let x = -r; x <= r; x++) acc += src[y * W + Math.min(W - 1, Math.max(0, x))]; for (let x = 0; x < W; x++) { tmp[y * W + x] = acc / n; acc += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)]; } }
          for (let x = 0; x < W; x++) { let acc = 0; for (let y = -r; y <= r; y++) acc += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]; for (let y = 0; y < H; y++) { out[y * W + x] = acc / n; acc += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]; } }
          return out;
        };
        // round 6: a narrow wrap (2 px, weaker): at 5 px it haloed the silhouette, "smooth, softened edges"
        const aB = box(alpha, 2);
        const bgB: Float32Array[] = [0, 1, 2].map((k) => { const ch = new Float32Array(W * H); for (let q = 0; q < W * H; q++) ch[q] = d[q * 4 + k] * (1 - alpha[q]); return box(box(ch, 9), 9); });
        const covB = box(box(Float32Array.from(alpha, (a) => 1 - a), 9), 9);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const q = y * W + x;
          const a = alpha[q];
          if (a <= 0.002) continue;
          const i = q * 4, c = (y * W2 + x) * 4;
          const wrap = Math.min(1, Math.max(0, a * (1 - aB[q]) * 2.4)) * 0.35;
          for (let k = 0; k < 3; k++) {
            const lit = cel[c + k] * tint[k];
            let v = night ? lit * wl + night[c + k] * (1 - wl) : lit;
            if (ex !== 1) v = v * ex * [1, 0.86, 0.66][k] + lift * [1, 0.68, 0.36][k] * a; // tungsten: amber, not lemon
            const env = covB[q] > 0.02 ? bgB[k][q] / covB[q] : 0; // the plate's light round this point, clay excluded
            v += (255 - v) * (env / 255) * wrap * a;
            d[i + k] = Math.min(255, Math.round(v + (1 - a) * d[i + k]));
          }
          if (ex !== 1) {
            const Y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
            // (the shoulder tops out at 192, 75 %: at 199 the encode lifted the flash to 79.6 %)
            if (Y > 150) { const s2 = (150 + 42 * (1 - Math.exp(-(Y - 150) / 42))) / Y; for (let k = 0; k < 3; k++) d[i + k] = Math.round(d[i + k] * s2); }
          }
        }
        ctx.putImageData(bg, TILE.x, TILE.y);
      }
      continueRender(h);
    })().catch((e) => cancelRender(e));
  }, [f]);
  return (
    <AbsoluteFill style={{background: '#04050a'}}>
      <canvas ref={ref} width={1920} height={1080} style={{width: '100%', height: '100%'}} />
    </AbsoluteFill>
  );
};
